import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models/school';
import { IClassRoom } from '../../_models/class-room';
import { IDashboardCity } from '../../_models/dashboard-models/dashboard-city'; 
import { IDashboardSchool } from '../../_models/dashboard-models/dashboard-school'; 
import { IDashboardClassRoom } from '../../_models/dashboard-models/dashboard-classroom'; 
import { IDashboardStudent } from '../../_models/dashboard-models/dashboard-student';
import { IDashboardTeacher } from '../../_models/dashboard-models/dashboard-teacher';
import {  IAttendance } from '../../_models/dashboard-models/dashboard-attendance';
import {catchError, tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
/**
 * This service processes the azure tables in order to provide the dashboard with the information needed to update.
 * It does this by first processing the School Table, ClassRoom Table, and then the Student Table. Next, it 
 * proccesses the atttendance table and uses the data from the other tables to build up an object that keeps track of 
 * attendance in cities, schools, and classes in order to easily answer requests made to the dashboard.
 */
export class DashboardService {

  data = {
    cities: new Map<string, { city: IDashboardCity, attendance: Map<string, IAttendance>} >(),
    schools: new Map<string, { school: IDashboardSchool, attendance: Map<string, IAttendance>}>(),
    classes: new Map<string, { classRoom: IDashboardClassRoom, attendance: Map<string, IAttendance>}>(),
    students: new Map<string, { student: IDashboardStudent, attendance: Map<string, boolean>}>(),
    teachers: new Map<string, { teacher: IDashboardTeacher, attendance: Map<string, boolean>}>(),
  }

  // Used to bypass interceptor to avoid page reload if error in retrieving data. This would otherwise cause 
  // constant reloads and eventually log the user out. 
  httpWithoutInterceptor: HttpClient;
  // Used to geocode addresses of cities into lat/long
  geocodingURl = "http://dev.virtualearth.net/REST/v1/Locations";
  bingMapsKey = "<Bing Maps API Key Here>"; 
  // URL of azure tables to get data from 
  url = "<URL Of Azure Tables Here>";
  // Secure Access Signature of attendance table
  attendanceSAS = "<Attendance SAS Here>";
  // Secure Access Signature of the student table 
  studentSAS = "<Student SAS Here>";

  constructor(
    private schoolService: SchoolService,
    private httpBackend: HttpBackend
  ) { 
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend); 
  }

  /**
   * Make Get requests to the azure table subscription to load in the correct Tables. Throw error if request 
   * to azure tables fails. 
   */
  public getData() { 
    let schoolTable = this.getSchoolTable(); // Will contain classes and students within individual school entries
    let attendanceTable = this.getAttendanceTable() // No backend set up, so done manually 
    let studentEnrollment = this.getStudentEnrollment();
    return forkJoin([schoolTable, attendanceTable, studentEnrollment]).pipe(
      tap((result) => this.processData(result[0], result[1], result[2])),
      catchError((err) => {
        throw err
      })
    );
  }

  /**
   * Takes the newly fetched school table and attendance table and uses it to store the attendance 
   * and other information of classes, schools, cities, and students. 
   * @param schoolTable ISchool array of all active schools 
   * @param attendanceTable array of attendance entries 
   */
  public processData(schoolTable: ISchool[], attendanceTable: any, studentEnrollment: any) {
    this.data.cities.clear();
    this.data.classes.clear();
    this.data.schools.clear();
    this.data.students.clear(); 

    this.processSchoolTable(schoolTable);
    this.processStudentEnrollment(studentEnrollment.value); 
    this.processAttendanceTable(attendanceTable.value);
  }
  
  /**
   * Processes the school table by creating a mapping from cities and schoolId's to information about the 
   * schools and cities including attendance. 
   */
  private processSchoolTable(schoolTable: ISchool[]) {
    // Map schoolId to city, will likely want to map schoolId to school so that 
    // all student information could be accessed. This is done in order to decrease database calls
    // which could be costly 
    for (let school of schoolTable) {
      let classRooms: IDashboardClassRoom[] = this.processClassRooms(school);
      let teachers: IDashboardTeacher[] = this.processTeachers(school);

      let dashSchool: IDashboardSchool = {
        name: school.name,
        id: school.id,
        address1: school.address1,
        address2: school.address1,
        country: school.country,
        state: school.state,
        city: school.city,
        zip: school.zip,
        latitude: school.latitude,
        longitude: school.longitude,
        classRooms: classRooms,
        teachers: teachers,
        averageAttendance: 0,
      }
      
      this.data.schools.set(school.id, { 
        school: dashSchool,
        attendance: new Map<string, IAttendance>()
      });
      if (this.data.cities.get(school.city) === undefined) {
        let city = {
          name: school.city,
          id: school.city,
          schools: [],
          averageAttendance: 0
        };
        this.data.cities.set(school.city, {
          city: city,
          attendance: new Map<string, IAttendance>()
        });
      } 
      this.data.cities.get(school.city).city.schools.push(dashSchool);
    }
  }

  /**
   * Processes the classes in a given school by creating a mapping from classId's to information about 
   * the classRoom including attendance. The number of teachers for the class room is currently marked 
   * as the number of teachers at the current school. 
   * @param classRooms all classes within a given school 
   */
  private processClassRooms(school: ISchool): IDashboardClassRoom[] {
    let classes: IDashboardClassRoom[] = [];
    school.classRooms.forEach((classRoom) => {
      let students: IDashboardStudent[] = this.processStudents(classRoom); 
      let temp = {
        name: classRoom.classRoomName,
        id: classRoom.classId,
        school: school.name,
        schoolId: school.id,
        city: school.city,
        classDivision: classRoom.classDivision,
        students: students,
        numTeachers: school.teachers.length,
        averageAttendance: 0,
      }
      classes.push(temp); 

      if (this.data.classes.get(temp.id) == undefined) {
        this.data.classes.set(temp.id, {
          classRoom: temp,
          attendance: new Map<string, IAttendance>()
        })
      }
    })
    return classes; 
  }

  /**
   * Processes the student table by creating a mapping from sutdent Id's to information about students 
   * including when they were enrolled. 
   * @param students Array of students in a given class 
   */
  private processStudents(classRoom: IClassRoom): IDashboardStudent[] {
    let dashStudents: IDashboardStudent[] = []; 
    classRoom.students.forEach((student) => {
      let temp: IDashboardStudent = {
        name: student.firstName + " " + student.lastName,
        id: student.id,
        classId: student.classId,
        schoolId: student.schoolId,
        city: student.city,
        gender: student.gender,
        enrollmentDate: "" + student.syncDateTime
      }
      dashStudents.push(temp);

      if (this.data.students.get(student.id) == undefined) {
        this.data.students.set(student.id, {
          student: temp,
          attendance: new Map<string, boolean>()
        });
      }
    })
    return dashStudents; 
  }

  /**
   * Process the raw student table data from azure, updates student stored in this.data to include 
   * the updatedOn time stamp which represents when student was enrolled. 
   * @param studentEnrollment Azure student table
   */
  private processStudentEnrollment(studentEnrollment: any[]) {
    for (let student of studentEnrollment) {
      let id: string = student.RowKey;      
      let tempTimeStamp: Date = new Date(student.TimeStamp);
      let tempUpdatedOn: Date = new Date(student.UpdatedOn);
      // Converts to string in order to count enrollments that occured on the same data identically. 
      let timeStamp: string = "" + (tempTimeStamp.getMonth() + 1) + "/" + tempTimeStamp.getDate() + "/" + tempTimeStamp.getFullYear();
      let updatedOn: string = "" + (tempUpdatedOn.getMonth() + 1) + "/" + tempUpdatedOn.getDate() + "/" + tempUpdatedOn.getFullYear();
      
      let enrollmentDate: string = tempTimeStamp < tempUpdatedOn ? timeStamp: updatedOn;
      if (this.data.students.get(id) != undefined) {
        this.data.students.get(id).student.enrollmentDate = enrollmentDate; 
      }
    }
  }


  /**
   * Parses teachers at given school
   * @param school school that teacher is in
   * @returns Array of teachers at school
   */
  private processTeachers(school: ISchool): IDashboardTeacher[] {
    let teachers: IDashboardTeacher[] = [];
    for (let teacher of school.teachers) {
      let temp = {
        name: teacher.firstName + " " + teacher.lastName,
        id: teacher.id,
        schoolId: teacher.schoolId
      }
      teachers.push(temp); 

      if (this.data.teachers.get(temp.id) == undefined) {
        this.data.teachers.set(temp.id, {
          teacher: temp,
          attendance: new Map<string, boolean>()
        })
      }
    }
    return teachers; 
  }

  /**
   * Attendance is stored as individual entries in the Attendance Table. As a result, in order to format 
   * the data, I go through each table entry and update the attendance data of the city, school, and class that 
   * this student was in. I also update the gender attendance for each city, school, and class. I keep track of 
   * daily attendance in order to allow different ways to display data on the dashboard. 
   */
  private processAttendanceTable(attendanceTable: any) {
    attendanceTable.forEach((entry) => {
      // if (this.data.students.get(entry.StudentId) == undefined) {
      //   console.log("Attendance Not Taken " + entry.StudentId);
      // }
      if (this.data.schools.get(entry.PartitionKey) != undefined && this.data.students.get(entry.StudentId) != undefined && this.data.teachers.get(entry.TeacherId) != undefined) {
        let city = this.data.schools.get(entry.PartitionKey).school.city;
        let schoolId = entry.PartitionKey; 
        let classId = entry.ClassRoomId;
        let gender = this.data.students.get(entry.StudentId).student.gender; 
        let studentId = entry.StudentId;
        let teacherId = entry.TeacherId
        if (gender !== "male" && gender !== "female") {
          gender = "nonBinary";
        }

        // Convert datetime to JavaScript Date and then convert into readable date format to ensure 
        // attendance taken at slightly different times of the same day still counts as the same day 
        let date = new Date(entry.Timestamp);
        let dateKey = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

        // Initailize the schoolAttendance map from day to cumulative attendance 
        if (this.data.schools.get(schoolId).attendance.get(dateKey) === undefined) {
          this.data.schools.get(schoolId).attendance.set(dateKey, {
            present: 0,
            total: 0,
            male: {
              present: 0,
              total: 0
            },
            female: {
              present: 0,
              total: 0
            },
            nonBinary: {
              present: 0,
              total: 0
            }
          });
        }

        // Initailize the city attendance map from day to cumulative attendance 
        if (this.data.cities.get(city).attendance.get(dateKey) === undefined) {
          this.data.cities.get(city).attendance.set(dateKey, {
            present: 0,
            total: 0,
            male: {
              present: 0,
              total: 0
            },
            female: {
              present: 0,
              total: 0
            },
            nonBinary: {
              present: 0,
              total: 0
            }
          });
        }

        // Initalize the map of day to attendance data inside the class map and finds out the total number of students 
        // In each city, school, and class
        if (this.data.classes.get(classId).attendance.get(dateKey) === undefined) {
          this.data.classes.get(classId).attendance.set(dateKey, {
            present: 0,
            total: 0,
            male: {
              present: 0,
              total: 0
            },
            female: {
              present: 0,
              total: 0
            },
            nonBinary: {
              present: 0,
              total: 0
            }
          });
        }

        // Student attendance marked. (If for some reason attendance was taken multiple times, updates attendance for student 
        // to be true if one of those entries is true). 
        if (this.data.students.get(studentId).attendance.get(dateKey) === undefined || !this.data.students.get(studentId).attendance.get(dateKey)) {
          this.data.students.get(studentId).attendance.set(dateKey, entry.Present)
        }

        // Teacher attendance is marked for each day that attendance was taken (Even if all students are absent)
        if (this.data.teachers.get(teacherId).attendance.get(dateKey) === undefined) {
          this.data.teachers.get(teacherId).attendance.set(dateKey, true);
        }

        // Update total number of students in class for cities, schools, classes 
        this.data.schools.get(schoolId).attendance.get(dateKey).total++;
        this.data.cities.get(city).attendance.get(dateKey).total++;
        this.data.classes.get(classId).attendance.get(dateKey).total++; 

        // Update present attendance for cities, schools, and classes 
        if (entry.Present) {
          this.data.cities.get(city).attendance.get(dateKey).present++;
          this.data.schools.get(schoolId).attendance.get(dateKey).present++;
          this.data.classes.get(classId).attendance.get(dateKey).present++;
        } 

        // Update cumulative gender attendance for cities, schools, and classes
        this.data.cities.get(city).attendance.get(dateKey)[gender].total++;
        this.data.schools.get(schoolId).attendance.get(dateKey)[gender].total++;
        this.data.classes.get(classId).attendance.get(dateKey)[gender].total++;
        if (entry.Present) {
          this.data.cities.get(city).attendance.get(dateKey)[gender].present++;
          this.data.schools.get(schoolId).attendance.get(dateKey)[gender].present++;
          this.data.classes.get(classId).attendance.get(dateKey)[gender].present++;
        }

        // Set the latitude and longitude of a school if it has not already been set. The attendance 
        // tracks the latitude and longitude in which attendance was taken, so, assuming it's at the school location, 
        // this should be the most accurate latitude and longitude for the school. 
        if (entry.Latitude && entry.Longitude) {
          this.data.schools.get(schoolId).school.latitude = entry.Latitude;
          this.data.schools.get(schoolId).school.longitude = entry.Longitude; 
        }
      }
    })
  }

  /**
   * Creates an array of observables that, when subscribed to, update the school latitude and longitude 
   * to be the result of whatever the geocoded address returns. 
   */
  public geocodeSchools() {
    let schoolObservables: Observable<Object>[] = [];
    for (let value of this.data.schools.values()) {
      // If the school does not already have a latitude or longitude then geocode the schools address to get 
      // a latitude and longitude for the schools 
      if (!value.school.latitude || !value.school.longitude) {
        schoolObservables.push(this.search(value.school)); 
      }
    }
    return forkJoin(schoolObservables);
  }

  /**
   * Uses api to geocode schools based on country, zipcode, city, and address. Chooses the top potential lat/long
   * @param school School to geocode
   */
  private search(school: IDashboardSchool): Observable<Object> {
    let endpoint = this.geocodingURl +  "?" + `countryRegion=${school.country}&lpostalCode=${school.zip}&addressLine=${school.address1}&locality=${school.city}&maxResults=${1}&key=${this.bingMapsKey}`;
    return this.getRequest(endpoint).pipe(
      tap((result: any) => {
        if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources.length > 0) {
          let point = result.resourceSets[0].resources[0].point;
          school.latitude = point.coordinates[0];
          school.longitude = point.coordinates[1];
        }
      })
    ); 
  }

  private getAttendanceTable() {
    let endpoint = this.url + "Attentdance()" + "?" + this.attendanceSAS;
    return this.getRequest(endpoint);
  }

  private getSchoolTable() {
    return this.schoolService.GetSchools();
  }
  
  private getStudentEnrollment() {
    let endpoint = this.url + "Student()" + "?$select=RowKey,UpdatedOn,Timestamp&" + this.studentSAS; 
    return this.getRequest(endpoint); 
  }

  private getRequest(endpoint: string) {
    return this.httpWithoutInterceptor.get(endpoint);
  }

  getCities(): IDashboardCity[] {
    let cities: IDashboardCity[] = []; 
    for (let city of this.data.cities.values()) {
      cities.push(city.city); 
    } 
    return cities; 
  }

  getActiveSchools(schools: IDashboardSchool[], start: Date, end: Date): number {
    return this.numActive(schools, 'schools', start, end); 
  }

  getActiveClasses(classRooms: IDashboardClassRoom[], start: Date, end: Date): number {
    return this.numActive(classRooms, 'classes', start, end); 
  }
  
  getActiveStudents(students: IDashboardStudent[], start: Date, end: Date): number {
    return this.numActive(students, 'students', start, end);
  }

  getActiveTeachers(teachers: IDashboardTeacher[], start: Date, end: Date) {
    return this.numActive(teachers, 'teachers', start, end) ;
  }

  /** 
   * Returns the number of active entities (students, teachers, classes, or school) within the currently selected start/end
   * dates. They are considered active if there is an attendance entry within those date ranges. 
   * 
   */
  numActive(data: IDashboardStudent[] | IDashboardTeacher[] | IDashboardSchool[]| IDashboardCity[], id: 'students' | 'teachers' | 'classes' | 'schools', start: Date, end: Date): number {
    let total = 0; 
    for (let item of data) {
      for (let entry of this.data[id].get(item.id).attendance.entries()) {        
        let date: Date = new Date(entry[0]);
        if (entry[1] && date >= start && date <= end) {
          total++;
          break; 
        }
      }
    }
    return total; 
  }

  /**
   * Returns the attendance data for classes, cities, or schools within the start/end date. Attendance data is stored 
   * in an array of object where name is the name of the class, citiy, or school, and attendance is an array of dates 
   * and attendance data for the attendance on that day. 
   * @param data list of selected schools, classRooms, or cities 
   * @param id type of data (classes, cities, or schools). This corresponds to the fieldin this.data
   * @param start start date
   * @param end end data 
   */
  public getAttendance(data: IDashboardSchool[] | IDashboardClassRoom[] | IDashboardCity[], id: "classes" | "cities" | "schools", start: Date, end: Date): {name: string, attendance: [Date, IAttendance][]}[] {
    let attendanceData: {name: string, attendance: [Date, IAttendance][]}[] = [];
    for (let item of data) {
      let attendance: {name: string, attendance: [Date, IAttendance][]} = {
        name: item.name,
        attendance: []
      }
      for (let entry of this.data[id].get(item.id).attendance.entries()) {
        let date: Date = new Date(entry[0]); 
        if (date >= start && date <= end) { 
          attendance.attendance.push([date, entry[1]]); 
        }
      }
      attendanceData.push(attendance); 
    }
    return attendanceData; 
  }

  getAverageSchoolAttendance(data: IDashboardSchool, start: Date, end: Date) {
    return this.getAverageAttendance(data, 'schools', start, end);
  }
  
  getAverageClassRoomAttendance(data: IDashboardClassRoom, start: Date, end: Date) {
    return this.getAverageAttendance(data, 'classes', start, end);
  }

  getAverageCityAttendance(data: IDashboardCity, start: Date, end: Date) {
    return this.getAverageAttendance(data, 'cities', start, end); 
  }

  /**
   * Calculates average attendance over time interval 
   * @param data list of selected schools, classes, or cities 
   * @param id corresponds to field in this.data
   * @param start start day
   * @param end end day 
   */
  private getAverageAttendance(data: IDashboardSchool | IDashboardClassRoom | IDashboardCity, id: "classes" | "cities" | "schools", start: Date, end: Date): number {
    let total = 0;
    let present = 0;
    for (let entry of this.data[id].get(data.id).attendance.entries()) {
      let attendance: IAttendance = entry[1];
      let date: Date = new Date(entry[0]); 
      if (date >= start && date <= end) { 
        total += attendance.total;
        present += attendance.present;
      }
    }
    return total == 0 ? 0 : Math.round(present / total * 100); 
  }
}