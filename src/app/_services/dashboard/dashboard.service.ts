import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models/school';
import { IClassRoom } from '../../_models/class-room';
import { IStudent } from '../../_models/student';
import { IDashboardCity } from '../../_models/dashboard-models/dashboard-city'; 
import { IDashboardSchool } from '../../_models/dashboard-models/dashboard-school'; 
import { IDashboardClassRoom } from '../../_models/dashboard-models/dashboard-classroom'; 
import { IDashboardStudent } from '../../_models/dashboard-models/dashboard-student';
import { IDashboardTeacher } from '../../_models/dashboard-models/dashboard-teacher';
import {  IAttendance } from '../../_models/dashboard-models/dashboard-attendance';
import {catchError, tap, timestamp} from 'rxjs/operators'; 
import { Embed } from 'powerbi-client';


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

  httpWithoutInterceptor: HttpClient;
  url = "https://goofflinee.table.core.windows.net/";
  attendanceSAS = "sv=2018-03-28&si=Attentdance-1763A06CFEA&tn=attentdance&sig=rGRdN1X0akvsp7ytPy1FWV%2FtsbD%2B9sLwv3XcZ8a7AJY%3D";
  studentSAS = "sv=2018-03-28&si=Student-17640438131&tn=student&sig=jdWSmr%2B9YW9SLIt%2B%2BdosxfKMjJMhURddmddGHSWja3c%3D";

  constructor(
    private http: HttpClient,
    private schoolService: SchoolService,
    private httpBackend: HttpBackend
  ) { 
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend); 
  }

  /**
   * Make Get requests to the azure table subscription to load in the correct Tables. Returns error if request 
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
    this.data.classes = new Map([...this.data.classes.entries()].sort());
  }
  
  /**
   * Processes the school table by creating a mapping from cities and schoolId's to information about the 
   * schools and cities including attendance. 
   */
  private processSchoolTable(schoolTable: ISchool[]) {
    // Map schoolId to city, will likely want to map schoolId to school so that 
    // all student information could be accessed. This is done in order to decrease database calls
    // which could be costly 
    schoolTable.forEach((school: ISchool) => {
      if (this.data.cities.get(school.city) === undefined) {
        let city = {
          name: school.city,
          id: school.city,
          schools: []
        };
        this.data.cities.set(school.city, {
          city: city,
          attendance: new Map<string, IAttendance>()
        });
      } 
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
        teachers: teachers
      }
      
      if (this.data.schools.get(school.id) === undefined) {
        this.data.schools.set(school.id, { 
          school: dashSchool,
          attendance: new Map<string, IAttendance>()
        });
        this.data.cities.get(school.city).city.schools.push(dashSchool); 
      }
    })
  }

  /**
   * Processes the classes in a given school by creating a mapping from classId's to information about 
   * the classRoom including attendance. 
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
        numTeachers: school.teachers.length
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

  private processStudentEnrollment(studentEnrollment: any[]) {
    for (let student of studentEnrollment) {
      let id: string = student.RowKey;      
      let tempTimeStamp: Date = new Date(student.TimeStamp);
      let tempUpdatedOn: Date = new Date(student.UpdatedOn);
      let timeStamp: string = "" + (tempTimeStamp.getMonth() + 1) + "/" + tempTimeStamp.getDate() + "/" + tempTimeStamp.getFullYear();
      let updatedOn: string = "" + (tempUpdatedOn.getMonth() + 1) + "/" + tempUpdatedOn.getDate() + "/" + tempUpdatedOn.getFullYear();
      
      let enrollmentDate: string = tempTimeStamp < tempUpdatedOn ? timeStamp: updatedOn;
      console.log(enrollmentDate);
      if (this.data.students.get(id) != undefined) {
        this.data.students.get(id).student.enrollmentDate = enrollmentDate; 
      }
    }
  }

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
      if (this.data.students.get(entry.StudentId) == undefined) {
        console.log("Attendance Not Taken " + entry.StudentId);
      }
      if (this.data.schools.get(entry.PartitionKey) != undefined && this.data.students.get(entry.StudentId) != undefined && this.data.teachers.get(entry.TeacherId) != undefined) {
        let city = this.data.schools.get(entry.PartitionKey).school.city;
        let schoolId = entry.PartitionKey; 
        let classId = entry.ClassRoomId;
        let gender = this.data.students.get(entry.StudentId).student.gender; 
        let studentId = entry.StudentId;
        let teacherId = entry.TeacherId
        console.log(teacherId);
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

        if (entry.Present && this.data.students.get(studentId).attendance.get(dateKey) === undefined) {
          this.data.students.get(studentId).attendance.set(dateKey, entry.Present)
        }

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
      }
    })
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

  numActive(data: IDashboardStudent[] | IDashboardTeacher[] | IDashboardSchool[]| IDashboardCity[], id: 'students' | 'teachers' | 'classes' | 'schools', start: Date, end: Date): number {
    let total = 0; 
    for (let item of data) {
      for (let entry of this.data[id].get(item.id).attendance.entries()) {
        let date: Date = new Date(entry[0]);
        if (date >= start && date <= end) {
          total++;
          break; 
        }
      }
    }
    return total; 
  }

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

  getCumulativeAttendance(data: IDashboardSchool | IDashboardClassRoom | IDashboardCity, id: "classes" | "cities" | "schools", start: Date, end: Date): number {
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