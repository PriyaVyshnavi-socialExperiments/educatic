import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CountryHelper } from '../../_helpers/countries';
import { ToastController } from '@ionic/angular';
import { TeacherService } from '../../_services/teacher/teacher.service';
import { DataShareService } from '../../_services/data-share.service';
import { ActivatedRoute } from '@angular/router';
import { ITeacher, Role } from 'src/app/_models';
import { SchoolService } from 'src/app/_services/school/school.service';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.page.html',
  styleUrls: ['./teacher-add.page.scss'],
})
export class TeacherAddPage implements OnInit, OnDestroy {

  public teacherForm: FormGroup;
  public teacher: any = {};
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
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.isEditTeacher = params.has('id');
    });

    this.teacherForm = this.formBuilder.group({
      school: new FormControl('', [
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
        Validators.maxLength(200),
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
            firstname: this.teacher.firstname,
            lastname: this.teacher.lastname,
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
    } else {
      this.getCountries();
    }
    this.getSchools();
  }

  get f() {
    return this.teacherForm.controls
  }

  SubmitTeacher() {
    if (this.teacherForm.invalid) {
      return;
    } else {
      const schoolInfo = {
        id: this.teacher?.id,
        schoolId: this.f.school.value,
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
      this.teacherService.SubmitTeacher(schoolInfo).subscribe(() => {
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
        this.countryInfo = data.Countries;
      }
    )
  }

  onChangeCountry(countryName) {
    console.log(countryName);
    this.stateInfo = this.countryInfo.find((c) => c.CountryName === countryName.value).States;
    this.cityInfo = this.stateInfo[0].Cities;
  }

  onChangeState(stateName) {
    this.cityInfo = this.stateInfo.find((s) => s.StateName === stateName.value).Cities;
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
