import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ITeacher, Role } from '../../_models';
import { SchoolService } from '../../_services/school/school.service';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { CustomEmailValidator } from '../../_helpers/custom-email-validator';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { CountryStateCityService } from 'src/app/_services/country-state-city/country-state-city.service';

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
  teacherId: string;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryStateCityService,
    private toastController: ToastController,
    private teacherService: TeacherService,
    private schoolService: SchoolService,
    private activatedRoute: ActivatedRoute,
    private emailValidator: CustomEmailValidator,
    private authenticationService: AuthenticationService,
    public router: Router,

  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.teacherId = this.activatedRoute.snapshot.paramMap.get('teacherId');
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
      gender: ['', [Validators.required]],
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

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.schoolInfo = user.schools;
      if (this.teacherId) {
        const schoolId = this.activatedRoute.snapshot.paramMap.get('schoolId');
        const school = user.schools.find((s) => s.id === schoolId);
        this.teacher = school.teachers.find((s) => s.id === this.teacherId);
        this.countryService.GetCountryWiseStatsCities(this.teacher.country, this.teacher.state).subscribe((country) => {
          this.countryInfo = country.Countries;
          this.stateInfo = country.States;
          this.cityInfo = country.Cities;
        });
        this.teacherForm.setValue({
          schoolId: this.teacher.schoolId,
          firstname: this.teacher.firstName,
          lastname: this.teacher.lastName,
          email: this.teacher.email,
          address1: this.teacher.address1,
          address2: this.teacher.address2,
          country: this.teacher.country,
          gender: this.teacher.gender,
          state: this.teacher.state,
          city: this.teacher.city,
          zip: this.teacher.zip
        });
        this.teacherForm.controls['email'].setAsyncValidators(
          this.emailValidator.existingEmailValidator(this.teacher.email));
      } else {
        this.teacherForm.controls['email'].setAsyncValidators(
          this.emailValidator.existingEmailValidator());
        this.getCountries();
      }
    });
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
        zip: this.f.zip.value,
        gender: this.f.gender.value,
        role: Role.Teacher
      } as ITeacher;
      this.teacherService.SubmitTeacher(teacherInfo).subscribe(() => {
        this.presentToast();
        this.router.navigateByUrl(`/teachers/${teacherInfo.schoolId}`);
      });
    }
  }

  getSchools() {
    this.schoolService.GetSchools().toPromise().then((schools) => {
      this.schoolInfo = schools;
    });
  }

  getCountries() {
    this.countryService.AllCountries().subscribe(
      (data: any) => {
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
      duration: 3000,
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
