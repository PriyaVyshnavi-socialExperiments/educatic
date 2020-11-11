import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  prod: boolean = false;
  // testData = schools;
  // data = Attendance; 
  //TODO Make types for all these things 
  studentTable;
  classTable;
  schoolTable;
  attendanceTable;
  data = {
    cities: new Map(),
    schools: new Map(),
    classes: new Map(),
    students: new Map()
  }
  url = "https://goofflinee.table.core.windows.net/";
  attendanceSAS = "?st=2020-11-11T17%3A55%3A49Z&se=2020-11-12T17%3A55%3A49Z&sp=r&sv=2018-03-28&tn=attentdance&sig=dE%2BRg40y3cK1T32%2BKGbUzzZ5IBTmsJYTfEhpyvfH9mU%3D";
  classRoomSAS = "?st=2020-11-11T17%3A56%3A15Z&se=2020-11-12T17%3A56%3A15Z&sp=r&sv=2018-03-28&tn=classroom&sig=szIVkvOB2mEL4Khc5vnNUzSamVKjxCzk4BSRGR3M0pY%3D";
  schoolSAS = "?st=2020-11-11T17%3A56%3A32Z&se=2020-11-12T17%3A56%3A32Z&sp=r&sv=2018-03-28&tn=school&sig=NsSShswJTaTr384zCCqJKMdWTssCqmDvydn5z3zDFOE%3D";
  studentSAS = "?st=2020-11-11T17%3A56%3A51Z&se=2020-11-12T17%3A56%3A51Z&sp=r&sv=2018-03-28&tn=student&sig=FRdXwFRaXSh3qthFh%2B34D2EjmEejEfMoPLsYS70La4I%3D";

  constructor(
    private http: HttpClient,
  ) { }

  getTables() {
    let schoolTable = this.getSchoolTable();
    let studentTable = this.getStudentTable();
    let attendanceTable = this.getAttendanceTable()
    let classTable = this.getClassTable();
    return forkJoin([schoolTable, studentTable, attendanceTable, classTable]);
  }

  public processData(schoolTable, studentTable, attendanceTable, classTable) {
    this.schoolTable = schoolTable;
    this.studentTable = studentTable;
    this.attendanceTable = attendanceTable;
    this.classTable = classTable; 
    this.processSchoolTable();
    this.processClassRoomTable();
    this.processStudentTable();
    this.processAttendanceTable();
    return this.data;
  }

  processSchoolTable() {
    // Map schoolId to city, will likely want to map schoolId to school so that 
    // all student information could be accessed. This is done in order to decrease database calls
    // which could be costly 
    this.schoolTable.forEach((entry) => {
      let school = {
        id: entry.PartitionKey,
        name: entry.Name,
        address1: entry.Address1,
        address2: entry.Address2,
        country: entry.Country,
        state: entry.State,
        city: entry.City,
        zip: entry.Zip,
        latitude: entry.Latitude,
        longitude: entry.Longitutde
      }
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
          classes: new Set(),
          attendance: new Map()
        });
      }
    })
  }

  processClassRoomTable() {
    this.classTable.forEach((entry) => {
      if (this.data.schools.get(entry.PartitionKey) !== undefined) {
        let classRoom = {
          classId: entry.RowKey,
          schoolId: entry.PartitionKey,
          classRoomName: entry.ClassRoomName,
          classDivision: entry.ClassDivision,
          createdBy: entry.CreatedBy,
          updatedBy: entry.UpdatedBy,
          students: new Set(),
        }
        if (!this.data.schools.get(classRoom.schoolId).classes.has(classRoom)) {
          this.data.schools.get(classRoom.schoolId).classes.add(classRoom)
        }
  
        if (this.data.classes.get(classRoom.classId) == undefined) {
          this.data.classes.set(classRoom.classId, {
            classRoom: classRoom,
            students: new Set(), 
            attendance: new Map()
          })
        }
      }
    })
  }

  processStudentTable() {
    // Map studentId to student gender, will likely want to map studentId to student so that 
    // all student information could be accessed 
    this.studentTable.forEach((entry) => {
      let student = {
        schoolId: entry.PartitionKey,
        classId: entry.ClassId,
        id: entry.RowKey,
        firstName: entry.FirstName,
        lastName: entry.LastName,
        enrolmentNo: entry.EnrolmentNo,
        gender: entry.Gender,
        address1: entry.Address1,
        address2: entry.Address2,
        country: entry.Country,
        state: entry.State,
        city: entry.City,
        zip: entry.Zip,
        latitude: entry.Latitude,
        longitude: entry.Longitude,
      }
      if (this.data.students.get(student.id) == undefined) {
        this.data.students.set(student.id, {
          gender: student.gender
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
  public processAttendanceTable() {
    this.attendanceTable.forEach((entry) => {
      if (this.data.students.get(entry.StudentId) === undefined) {
        console.log("Attendance Not Taken " + entry.StudentId);
      }
      if (this.data.schools.get(entry.PartitionKey) != undefined && this.data.students.get(entry.StudentId) != undefined) {
        let city = this.data.schools.get(entry.PartitionKey).school.city;
        let schoolId = entry.PartitionKey; 
        let classId = entry.ClassRoomId;

        // Convert datetime to JavaScript Date and then convert into readable date format to ensure 
        // attendance taken at slightly different times of the same day still counts as the same day 
        let date = new Date(entry.Timestamp);
        let dateKey = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();

        // Initalize the map of day to attendance data inside the class map
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

        // Format indivudal student attendance data for each student
        let attendanceData = {
          present: entry.Present,
          studentId: entry.StudentId,
          gender: this.data.students.get(entry.StudentId).gender
        }

        if (attendanceData.gender !== "male" && attendanceData.gender !== "female") {
          attendanceData.gender = "nonBinary";
        }

        // Update cumulative attendance for cities, schools, and classes 
        this.data.cities.get(city).attendance.get(dateKey).total++;
        this.data.schools.get(schoolId).attendance.get(dateKey).total++;
        this.data.classes.get(classId).attendance.get(dateKey).total++;
        if (attendanceData.present) {
          this.data.cities.get(city).attendance.get(dateKey).present++;
          this.data.schools.get(schoolId).attendance.get(dateKey).present++;
          this.data.classes.get(classId).attendance.get(dateKey).present++;
        }

        // Update cumulative gender attendance for cities, schools, and classes
        this.data.cities.get(city).attendance.get(dateKey)[attendanceData.gender].total++;
        this.data.schools.get(schoolId).attendance.get(dateKey)[attendanceData.gender].total++;
        this.data.classes.get(classId).attendance.get(dateKey)[attendanceData.gender].total++;
        if (attendanceData.present) {
          this.data.cities.get(city).attendance.get(dateKey)[attendanceData.gender].present++;
          this.data.schools.get(schoolId).attendance.get(dateKey)[attendanceData.gender].present++;
          this.data.classes.get(classId).attendance.get(dateKey)[attendanceData.gender].present++;
        }
      }
    })
  }



  public getAttendanceTable() {
    let endpoint = this.url + "Attentdance()" + this.attendanceSAS; 
    return this.getRequest(endpoint);
  }

  public getSchoolTable() {
    let endpoint = this.url + "School()" + this.schoolSAS; 
    return this.getRequest(endpoint)
  }

  public getClassTable() {
    let endpoint = this.url + "ClassRoom()" + this.classRoomSAS;
    return this.getRequest(endpoint);
  }

  public getStudentTable() {
    let endpoint = this.url + `Student()` + this.studentSAS;
    return this.getRequest(endpoint);    
  }

  public getRequest(endpoint: string) {
    try {
      return this.http.get(endpoint);
    } catch (err) {
      console.log(err);
    }
  }
}