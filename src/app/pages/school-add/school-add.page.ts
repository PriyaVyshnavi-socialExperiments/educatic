import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ISchool } from '../../_models';
import { CountryHelper } from '../../_helpers/countries';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-school-add',
  templateUrl: './school-add.page.html',
  styleUrls: ['./school-add.page.scss'],
})
export class SchoolAddPage implements OnInit {

  public schoolForm: FormGroup;
  public school: ISchool;
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  state$: Observable<object>;

  constructor(
    private formBuilder: FormBuilder,
    private countryHelper: CountryHelper,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.getCountries();
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((state) => {
        this.school = state?.currentSchool as ISchool
      });

    this.schoolForm = this.formBuilder.group({
      name: new FormControl(this.school?.name, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      address1: new FormControl(this.school?.address1, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      address2: new FormControl(this.school?.address2, [
        Validators.maxLength(100),
      ]),
      country: new FormControl(this.school?.country, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      state: new FormControl(this.school?.state, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      city: new FormControl(this.school?.city, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      zip: new FormControl(this.school?.zip, [
        Validators.required,
        Validators.maxLength(10),
      ]),
    });
  }

  get f() {
    return this.schoolForm.controls;
  }
  UpdateSchool() {

  }

  getCountries() {
    this.countryHelper.AllCountries().
      subscribe(
        data => {
          this.countryInfo = data.Countries;
        },
        err => console.log(err),
        () => console.log('complete')
      )
  }

  onChangeCountry(countryValue) {
    console.log(countryValue);
    this.stateInfo = this.countryInfo[countryValue.value].States;
    this.cityInfo = this.stateInfo[0].Cities;
  }

  onChangeState(stateValue) {
    this.cityInfo = this.stateInfo[stateValue.value].Cities;
  }
}
