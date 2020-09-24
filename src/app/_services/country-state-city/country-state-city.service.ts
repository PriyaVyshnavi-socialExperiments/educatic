import { Injectable, Injector } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../_models/countries-states-cities';
import { tap, map, flatMap } from 'rxjs/operators';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class CountryStateCityService extends OfflineService {

  constructor(private http: HttpClient, public injector: Injector) {
    super(injector);
  }

  public GetCountryWiseStatsCities(countryName: string, stateName: string) {
    return this.AllCountries().pipe(
      flatMap((countryInfo) => {
        const states = countryInfo.find((c) => c.name === countryName).states;
        const cities = states.find((s) => s.name === stateName).cities;
        return of({
          Countries: countryInfo,
          States: states,
          Cities: cities
        });
      })
    );
  }

  public AllCountries(): Observable<Country[]> {
    return this.GetOfflineAllCountries().pipe(
      flatMap((countryInfo) => {
        if (!countryInfo) {
          return this.SyncCountries();
        } else {
          return of(countryInfo);
        }
      })
    );
  }

  private SyncCountries(): Observable<Country[]> {
    return this.http
      .get<Country[]>('./assets/countries/countries-states-cities.json')
      .pipe(
        map((countries) => countries),
        tap((countries) => {
          this.SetOfflineData('countries-states-cities', 'countries-states-cities', countries);
        })
      );
  }

  private GetOfflineAllCountries() {
    return from(this.GetOfflineData('countries-states-cities', 'countries-states-cities')).pipe(
      tap(countryData => {
        if (countryData && countryData.length > 0) {
          return countryData as Country[];
        } else {
          return of(false);
        }
      })
    );
  }
}
