import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models/school';
import { IClassRoom } from '../../_models/class-room';
import { IStudent } from '../../_models/student';
import { ChartService } from '../../_services/dashboard/chart.service';

@Injectable({
  providedIn: 'root'
})
/**
 * This service processes the azure tables in order to provide the dashboard with the information needed to update.
 * It makes four calls to do this, to the School Table, Student Table, Attendance Table, and the ClassRoom Table.
 */
export class DashboardService {
  prod: boolean = false;
  studentTable: IStudent[];
  classTable: IClassRoom[];
  schoolTable: ISchool[];
  attendanceTable;
  data = {
    cities: new Map(),
    schools: new Map(),
    classes: new Map(),
    students: new Map()
  }
  url = "https://goofflinee.table.core.windows.net/";
  attendanceSAS = "?sv=2018-03-28&si=Attentdance-1761217FECC&tn=attentdance&sig=QVmjYIYbHeldHrcjQ5W145al9AyszZoXC55VmnHhwho%3D";

  constructor(
    private http: HttpClient,
    private schoolService: SchoolService,
    private chartService: ChartService
  ) { }

  /**
   * Make Get requests to the azure table subscription to load in the correct Tables. T
   */
  public getTables() {
    let schoolTable = this.getSchoolTable(); // Will contain classes and students within individual school entries
    let attendanceTable = this.getAttendanceTable() // No backend set up, so done manually 
    return forkJoin([schoolTable, attendanceTable]);
  }

  public processData(schoolTable: ISchool[], attendanceTable) {
    this.data = {
      cities: new Map(),
      schools: new Map(),
      classes: new Map(),
      students: new Map()
    }
    this.schoolTable = schoolTable;
    this.attendanceTable = attendanceTable.value;
    this.processSchoolTable();
    this.processAttendanceTable();
    this.data.classes = new Map([...this.data.classes.entries()].sort());
    return this.data;
  }

  private processSchoolTable() {
    // Map schoolId to city, will likely want to map schoolId to school so that 
    // all student information could be accessed. This is done in order to decrease database calls
    // which could be costly 
    this.schoolTable.forEach((school: ISchool) => {
      if (this.data.cities.get(school.city) === undefined) {
        this.data.cities.set(school.city, {
          schools: new Set(),
          attendance: new Map()
        })
      }
      this.data.cities.get(school.city).schools.add(school);

      if (this.data.schools.get(school.id) === undefined) {
        this.data.schools.set(school.id, { 
          school: school,
          attendance: new Map()
        });
      }
      this.processClassRooms(school.classRooms);
    })
  }

  private processClassRooms(classRooms: IClassRoom[]) {
    classRooms.forEach((classRoom) => {
      if (this.data.classes.get(classRoom.classId) == undefined) {
        this.data.classes.set(classRoom.classId, {
          classRoom: classRoom,
          attendance: new Map()
        })
        this.processStudents(classRoom.students);
      }
    })
  }

  private processStudents(students: IStudent[]) {
    // Map studentId to student gender, will likely want to map studentId to student so that 
    // all student information could be accessed 
    students.forEach((student) => {
      if (this.data.students.get(student.id) == undefined) {
        this.data.students.set(student.id, {
          student: student,
        });
      }
    })
  }

  /**
   * Attendance is stored as individual entries in the Attendance Table. As a result, in order to format 
   * the data, I go through each table entry and build up a map of:
   *      cities -> city attendance data -> dates -> cummulative city/gender attendance 
   *             -> schools -> school attendance data -> dates -> cummulatice school/gender attendance 
   *                        -> classes -> class attendance data -> dates -> cummulative class/gender attendance
   * Simply, I map cities to the schools in the city. I map schools to the classes in the school. And for 
   * schools, cities, and classes, I keep track of total attendance for each date attenance was recorded.
   */
  private processAttendanceTable() {
    this.attendanceTable.forEach((entry) => {
      if (this.data.students.get(entry.StudentId) === undefined) {
        console.log("Attendance Not Taken " + entry.StudentId);
      }
      if (this.data.schools.get(entry.PartitionKey) != undefined && this.data.students.get(entry.StudentId) != undefined) {
        let city = this.data.schools.get(entry.PartitionKey).school.city;
        let schoolId = entry.PartitionKey; 
        let classId = entry.ClassRoomId;
        let gender = this.data.students.get(entry.StudentId).student.gender; 

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
            studentData: [],
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

    
        if (gender !== "male" && gender !== "female") {
          gender = "nonBinary";
        }

        // Update total number of students in class for cities, schools, classes 
        this.data.schools.get(schoolId).attendance.get(dateKey).total++;
        this.data.cities.get(city).attendance.get(dateKey).total++;
        this.data.classes.get(classId).attendance.get(dateKey).total++; 

        // Update present attendance for cities, schools, and classes 
        if (entry.present) {
          this.data.cities.get(city).attendance.get(dateKey).present++;
          this.data.schools.get(schoolId).attendance.get(dateKey).present++;
          this.data.classes.get(classId).attendance.get(dateKey).present++;
        } 

        // Update cumulative gender attendance for cities, schools, and classes
        this.data.cities.get(city).attendance.get(dateKey)[gender].total++;
        this.data.schools.get(schoolId).attendance.get(dateKey)[gender].total++;
        this.data.classes.get(classId).attendance.get(dateKey)[gender].total++;
        if (entry.present) {
          this.data.cities.get(city).attendance.get(dateKey)[gender].present++;
          this.data.schools.get(schoolId).attendance.get(dateKey)[gender].present++;
          this.data.classes.get(classId).attendance.get(dateKey)[gender].present++;
        }
      }
    })
  }

  private getAttendanceTable() {
    let endpoint = this.url + "Attentdance()" + this.attendanceSAS;
    return this.getRequest(endpoint);
  }

  private getSchoolTable() {
    // Using school service (Gets rid of inactive/deleted schools)
    // let endpoint = this.url + "School()" + this.schoolSAS;
    return this.schoolService.GetSchools();
  }

  // private getClassTable() {
  //   let endpoint = this.url + "ClassRoom()" + this.classRoomSAS;
  //   return this.getRequest(endpoint);
  // }

  // private getStudentTable() {
  //   let endpoint = this.url + "Student()" + this.studentSAS;
  //   return this.getRequest(endpoint);    
  // }


  private getRequest(endpoint: string) {
    try {
      return this.http.get(endpoint);
    } catch (err) {
      console.log(err);
    }
  }

  getBarChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string) {
    return this.chartService.getBarChart(id, xAxisTitle, yAxisTitle, title); 
  }

  getLineChart(id: string, xAxisTitle: string, yAxisTitle: string, title: string) {
    return this.chartService.getLineChart(id, xAxisTitle, yAxisTitle, title); 
  }

  updateSchoolBarChart(schools: ISchool[]) {
    return this.chartService.updateBarChart(this.data, schools, 'schools'); 
  }

  updateSchoolLineChart(schools: ISchool[]) {
    return this.chartService.updateLineChart(this.data, schools, 'schools');
  }

  updateClassLineChart(classes: any[]) {
    return this.chartService.updateLineChart(this.data, classes, 'classes');
  }

  updateClassBarChart(classes: any[]) {
    return this.chartService.updateBarChart(this.data, classes, 'classes');
  }

  updateCityBarChart(cities: any[]) {
    return this.chartService.updateBarChart(this.data, cities, 'cities');
  }

  updateCityLineBarChart(cities: any[]) {
    return this.chartService.updateLineChart(this.data, cities, 'cities');
  }

  updateGenderBarChart(data: any[]) {
    return this.chartService.updateGenderBarChart(data); 
  }
}