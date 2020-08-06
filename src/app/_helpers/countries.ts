import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Countries } from '../_models/country-state-city';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class CountryHelper {
    constructor(private http: HttpClient) { }

    public AllCountries(): Observable<Countries> {
        return this.http
            .get<Countries>('./assets/countries/countries.json')
            .pipe(map(countries => countries));
    }

}