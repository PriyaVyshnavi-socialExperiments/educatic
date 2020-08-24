import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../_models/countres-states-cities';


@Injectable({
    providedIn: 'root'
})

export class CountryHelper {

    constructor(private http: HttpClient) { }

    public AllCountries(): Observable<Country[]> {
        return this.http
            .get<Country[]>('./assets/countries/countries-states-cities.json')
            .pipe(map(countries => countries));
    }

    getSelectedCountryWiseStatsCities(countryName: string, stateName: string) {
        return this.AllCountries().toPromise().then(
            countryInfo => {
                const states = countryInfo.find((c) => c.name === countryName).states;
                const cities = states.find((s) => s.name === stateName).cities;
                return {
                    Countries: countryInfo,
                    States: states,
                    Cities: cities
                };
            }
        )
    }

}