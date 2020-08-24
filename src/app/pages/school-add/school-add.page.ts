import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CountryHelper } from '../../_helpers/countries';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { SchoolService } from '../../_services/school/school.service';
import { DataShareService } from '../../_services/data-share.service';
import { ISchool } from '../../_models/school';

@Component({
  selector: 'app-school-add',
  templateUrl: './school-add.page.html',
  styleUrls: ['./school-add.page.scss'],
})
export class SchoolAddPage implements OnInit, OnDestroy {

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
    private countryHelper: CountryHelper,
    private toastController: ToastController,
    private schoolService: SchoolService,
    private dataShare: DataShareService,
    private route: ActivatedRoute
  ) {

    //this.getLocation();

  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.isEditSchool = params.has('id');
    });

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

    //this.getCountries();

    if (this.isEditSchool) {
      this.dataShare.getData().subscribe((data) => {
        this.school = data;
        this.countryHelper.getSelectedCountryWiseStatsCities(this.school.country, this.school.state).then((country) => {
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
        latitude: '19.9894', //this.latitude.toString(),
        longitude: '73.7276',//this.longitude.toString(),
        zip: this.f.zip.value
      } as ISchool;
      this.schoolService.SubmitSchool(schoolInfo).subscribe(() => {
        this.presentToast();
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

  async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile changed successfully..',
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

  ngOnDestroy() {
  }
}
