import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CountryHelper } from '../../_helpers/countries';
import { ITeacher, Role } from '../../_models';
import { DataShareService } from '../../_services/data-share.service';
import { SchoolService } from '../../_services/school/school.service';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { CustomEmailValidator } from '../../_helpers/custom-email-validator';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.page.html',
  styleUrls: ['./teacher-add.page.scss'],
})
export class TeacherAddPage implements OnInit, OnDestroy {

  public teacherForm: FormGroup;
  public teacher: ITeacher;
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  schoolInfo: any[] = [];
  latitude: number;
  longitude: number;
  isEditTeacher = false;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: FormBuilder,
    private countryHelper: CountryHelper,
    private toastController: ToastController,
    private teacherService: TeacherService,
    private schoolService: SchoolService,
    private dataShare: DataShareService,
    private activatedRoute: ActivatedRoute,
    private emailValidator: CustomEmailValidator,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.isEditTeacher = this.activatedRoute.snapshot.paramMap.has('teacherId');

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.schoolInfo = user.schools;
    });

    // this.getSchools();
    this.teacherForm = this.formBuilder.group({
      schoolId: new FormControl('', [
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
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        Validators.maxLength(200)
      ]),
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

    if (this.isEditTeacher) {
      this.dataShare.getData().subscribe((data) => {
        this.teacher = data;
        this.countryHelper.getSelectedCountryWiseStatsCities(this.teacher.country, this.teacher.state).then((country) => {
          this.countryInfo = country.Countries;
          this.stateInfo = country.States;
          this.cityInfo = country.Cities;
        });
        if (this.teacher) {
          this.teacherForm.setValue({
            schoolId: this.teacher.schoolId,
            firstname: this.teacher.firstName,
            lastname: this.teacher.lastName,
            email: this.teacher.email,

            address1: this.teacher.address1,
            address2: this.teacher.address2,
            country: this.teacher.country,
            state: this.teacher.state,
            city: this.teacher.city,
            zip: this.teacher.zip
          });
        }
      });
      this.teacherForm.controls['email'].setAsyncValidators(
        this.emailValidator.existingEmailValidator(this.teacher.email));
    } else {
      this.teacherForm.controls['email'].setAsyncValidators(
        this.emailValidator.existingEmailValidator());
      this.getCountries();
    }
  }

  get f() {
    return this.teacherForm.controls
  }

  SubmitTeacher() {
    if (this.teacherForm.invalid) {
      return;
    } else {
      const teacherInfo = {
        id: this.teacher?.id,
        schoolId: this.f.schoolId.value,
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
        role: Role.Teacher
      } as ITeacher;
      this.teacherService.SubmitTeacher(teacherInfo).subscribe(() => {
        this.presentToast();
        this.teacherForm.reset(this.teacherForm.value);
      });
    }
  }

  getSchools() {
    this.schoolService.GetSchools().toPromise().then((schools) => {
      this.schoolInfo = schools;
    });
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

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Teacher updated successfully..',
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
