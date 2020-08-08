import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Countries, CountryStateCity } from '../_models/country-state-city';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class CountryHelper {

    private countryStateCity: CountryStateCity;

    constructor(private http: HttpClient) { }

    public AllCountries(): Observable<Countries> {
        return this.http
            .get<Countries>('./assets/countries/countries.json')
            .pipe(map(countries => countries));
    }

    getSelectedCountryWiseStatsCities(countryName: string, stateName: string) {
        return this.AllCountries().toPromise().then(
            countryInfo => {
                const states = countryInfo.Countries.find((c) => c.CountryName === countryName).States;
                const cities = states.find((s) => s.StateName === stateName).Cities;
                return {
                    Countries: countryInfo.Countries,
                    States: states,
                    Cities: cities
                };
            }
        )
    }

}