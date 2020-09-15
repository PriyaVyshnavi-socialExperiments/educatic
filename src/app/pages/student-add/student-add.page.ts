import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IStudent, Role, IUser, ISchool, IClassRoom } from 'src/app/_models';
import { StudentService } from 'src/app/_services/student/student.service';
import { ClassRoomService } from 'src/app/_services/class-room/class-room.service';
import { AuthenticationService } from '../../_services';
import { CustomEmailValidator } from 'src/app/_helpers/custom-email-validator';
import { CountryStateCityService } from 'src/app/_services/country-state-city/country-state-city.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.page.html',
  styleUrls: ['./student-add.page.scss'],
})
export class StudentAddPage implements OnInit, OnDestroy {

  public studentForm: FormGroup;
  public student: IStudent;
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  classRoomInfo: IClassRoom;
  classInfo: IClassRoom[] = [];
  latitude: number;
  longitude: number;
  currentUser: IUser;

  constructor(
    private formBuilder: FormBuilder,
    private countryHelper: CountryStateCityService,
    private toastController: ToastController,
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.studentForm = this.formBuilder.group({
      classId: new FormControl('', [
        Validators.required
      ]),
      firstname: new FormControl('', [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      enrolmentNo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ]),
      ),
      address1: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      address2: new FormControl('', [
        Validators.maxLength(100),
      ]),
      country: new FormControl('', [
        Validators.required,
      ]),
      state: new FormControl('', [
        Validators.required,
      ]),
      city: new FormControl('', [
        Validators.required,
      ]),
      zip: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
      ]),
    });

    const studentId = this.activatedRoute.snapshot.paramMap.get('studentId');
    const classId = this.activatedRoute.snapshot.paramMap.get('classId');

    this.authService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.classInfo = user.defaultSchool.classRooms;
      this.classRoomInfo = this.classInfo.find((c) => c.classId === classId)

      if (studentId) {
        this.student = this.classRoomInfo.students.find((s) => s.id === studentId)
        this.countryHelper.GetCountryWiseStatsCities(this.student.country, this.student.state).then((country) => {
          this.countryInfo = country.Countries;
          this.stateInfo = country.States;
          this.cityInfo = country.Cities;
        });
        this.studentForm.setValue({
          classId: this.student.classId,
          firstname: this.student.firstName,
          lastname: this.student.lastName,
          enrolmentNo: this.student.enrolmentNo,

          address1: this.student.address1,
          address2: this.student.address2,
          country: this.student.country,
          state: this.student.state,
          city: this.student.city,
          zip: this.student.zip
        });
      } else {
        this.getCountries();
      }
    });
  }

  ngOnDestroy(): void {

  }
  get f() {
    return this.studentForm.controls
  }

  SubmitStudent() {
    if (this.studentForm.invalid) {
      return;
    } else {
      const studentInfo = {
        id: this.student?.id,
        classId: this.f.classId.value,
        schoolId: this.currentUser.defaultSchool.id,
        firstName: this.f.firstname.value,
        lastName: this.f.lastname.value,
        enrolmentNo: this.f.enrolmentNo.value,
        address1: this.f.address1.value,
        address2: this.f.address2.value,
        country: this.f.country.value,
        state: this.f.state.value,
        city: this.f.city.value,
        zip: this.f.zip.value,
        role: Role.Student,
        profileStoragePath: this.student.profileStoragePath
      } as IStudent;
      this.studentService.SubmitStudent(studentInfo).subscribe((res) => {
        this.student = studentInfo;
        this.student.id = res.studentId;
        this.presentToast();
        this.router.navigateByUrl(`/students/${this.currentUser.defaultSchool.id}/${this.student.classId}`);
      });
    }
  }

  getCountries() {
    this.countryHelper.AllCountries().then(
      data => {
        this.countryInfo = data;
      }
    )
  }

  onChangeCountry(countryName) {
    this.stateInfo = this.countryInfo.find((c) => c.name === countryName.value).states;
  }

  onChangeState(stateName) {
    this.cityInfo = this.stateInfo.find((s) => s.name === stateName.value).cities;
  }

  onChangeSchool(schoolId) {
    this.classRoomService.GetClassRooms(schoolId.value).toPromise().then((data) => {
      this.classInfo = data;
    });
  }

  UploadPhoto() {
    this.router.navigateByUrl(`${this.currentUser.defaultSchool.id}/${this.student.classId}/student/${this.student.id}/photos`);
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Student updated successfully..',
      position: 'bottom',
      duration: 5000,
      color: 'success',
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
