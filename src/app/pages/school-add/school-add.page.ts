import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models/school';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { CountryStateCityService } from 'src/app/_services/country-state-city/country-state-city.service';

@Component({
  selector: 'app-school-add',
  templateUrl: './school-add.page.html',
  styleUrls: ['./school-add.page.scss'],
})
export class SchoolAddPage implements OnInit {

  public schoolForm: FormGroup;
  public school: any = {};
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  latitude: number;
  longitude: number;
  isEditSchool = false;

  constructor(
    private formBuilder: FormBuilder,
    private countryHelper: CountryStateCityService,
    private toastController: ToastController,
    private schoolService: SchoolService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public router: Router,
  ) {
  }

  ngOnInit() {

    this.isEditSchool = this.activatedRoute.snapshot.paramMap.has('id');

    this.schoolForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
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
        Validators.maxLength(50),
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      zip: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
    });

    if (this.isEditSchool) {
      const schoolId = this.activatedRoute.snapshot.paramMap.get('id');

      this.authenticationService.currentUser?.subscribe((user) => {
        if (!user) {
          return;
        }
        this.school = user.schools.find((s) => s.id === schoolId);
        this.countryHelper.GetCountryWiseStatsCities(this.school.country, this.school.state).then((country) => {
          this.countryInfo = country.Countries;
          this.stateInfo = country.States;
          this.cityInfo = country.Cities;
        });

        if (this.school) {
          this.schoolForm.setValue({
            name: this.school.name,
            address1: this.school.address1,
            address2: this.school.address2,
            country: this.school.country,
            state: this.school.state,
            city: this.school.city,
            zip: this.school.zip
          });
        }
      });
    } else {
      this.getCountries();
    }
  }

  get f() {
    return this.schoolForm.controls
  }

  UpdateSchool() {
    if (this.schoolForm.invalid) {
      return;
    } else {
      const schoolInfo = {
        id: this.school?.id,
        name: this.f.name.value,
        address1: this.f.address1.value,
        address2: this.f.address2.value,
        country: this.f.country.value,
        state: this.f.state.value,
        city: this.f.city.value,
        zip: this.f.zip.value
      } as ISchool;
      this.schoolService.SubmitSchool(schoolInfo).subscribe(() => {
        this.presentToast().then(() => {
          this.router.navigateByUrl(`/schools`);
        });
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

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'School create/update successfully..',
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
