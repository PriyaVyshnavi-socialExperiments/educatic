import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CountryHelper } from 'src/app/_helpers/countries';
import { IStudent, Role, IUser, ISchool } from 'src/app/_models';
import { DataShareService } from 'src/app/_services/data-share.service';
import { StudentService } from 'src/app/_services/student/student.service';
import { SchoolService } from 'src/app/_services/school/school.service';
import { ClassRoomService } from 'src/app/_services/class-room/class-room.service';
import { AuthenticationService } from '../../_services';
import { CustomEmailValidator } from 'src/app/_helpers/custom-email-validator';

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
  schoolInfo: ISchool;
  classInfo: any[] = [];
  latitude: number;
  longitude: number;
  isEdit = false;
  currentUser: IUser;

  constructor(
    private formBuilder: FormBuilder,
    private countryHelper: CountryHelper,
    private toastController: ToastController,
    private studentService: StudentService,
    private classRoomService: ClassRoomService,
    private dataShare: DataShareService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private emailValidator: CustomEmailValidator,
    public router: Router,
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.schoolInfo = user.defaultSchool;
      this.classInfo = user.defaultSchool.classRooms;
    });
    this.isEdit = this.activatedRoute.snapshot.paramMap.has('studentId');
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
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        Validators.maxLength(200)
      ]),
        //Validators.composeAsync([this.emailValidator.existingEmailValidator()])
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

    if (this.isEdit) {
      this.dataShare.getData().subscribe((data) => {
        this.student = data;
        this.countryHelper.getSelectedCountryWiseStatsCities(this.student.country, this.student.state).then((country) => {
          this.countryInfo = country.Countries;
          this.stateInfo = country.States;
          this.cityInfo = country.Cities;
        });
        if (this.student) {
          this.studentForm.setValue({
            classId: this.student.classId,
            firstname: this.student.firstName,
            lastname: this.student.lastName,
            email: this.student.email,

            address1: this.student.address1,
            address2: this.student.address2,
            country: this.student.country,
            state: this.student.state,
            city: this.student.city,
            zip: this.student.zip
          });
        }
      });
      this.studentForm.controls['email'].setAsyncValidators(
        this.emailValidator.existingEmailValidator(this.student.email));
    } else {
      this.studentForm.controls['email'].setAsyncValidators(
        this.emailValidator.existingEmailValidator());
      this.getCountries();
    }
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
        schoolId: this.schoolInfo.id,
        firstName: this.f.firstname.value,
        lastName: this.f.lastname.value,
        email: this.f.email.value,
        address1: this.f.address1.value,
        address2: this.f.address2.value,
        country: this.f.country.value,
        state: this.f.state.value,
        city: this.f.city.value,
        latitude: '19.9894', //this.latitude.toString(),
        longitude: '73.7276',//this.longitude.toString(),
        zip: this.f.zip.value,
        role: Role.Student
      } as IStudent;
      this.studentService.SubmitStudent(studentInfo).subscribe((res) => {
        this.student = studentInfo;
        this.student.id = res.studentId;
        this.presentToast();
        this.dataShare.setData(this.student);
        this.router.navigateByUrl(`/student/${this.currentUser.defaultSchool.id}/${this.student.classId}/edit/${this.student.id}`);
        //this.studentForm.reset(this.studentForm.value);
      });
    }
  }

  getCountries() {
    this.countryHelper.AllCountries().toPromise().then(
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
