import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { IMenuItems } from 'src/app/_models';
import { Country } from 'src/app/_models/countries-states-cities';
import { environment } from 'src/environments/environment';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends OfflineService {

  constructor(private http: HttpClient, public injector: Injector) {
    super(injector);
  }

  public SyncStaticData() {
    this.SyncCountries();
  }

  private SyncCountries() {
    this.GetOfflineData('countries-states-cities', 'countries-states-cities').then((countryData) => {
      if (countryData && countryData.length > 0) {
        return;
      }

      this.http
        .get<Country[]>(`${environment.blobURL}/static-content/countries-states-cities.json`)
        .pipe(
          map((countries) => countries),
          tap((countries) => {
            this.SetOfflineData('countries-states-cities', 'countries-states-cities', countries);
          })
        ).subscribe();
    });
  }

  private SyncMenus(): Observable<IMenuItems[]> {
    return from(this.GetOfflineData('nav-menus', 'nav-menus')).pipe(
      tap(menuData => {
        if (menuData && menuData.length > 0) {
          return of(true);
        } else {
          return this.http
            .get<IMenuItems[]>(`${environment.blobURL}/static-content/nav-menus.json`)
            .pipe(
              map((menus) => menus),
              tap((menus) => {
                this.SetOfflineData('nav-menus', 'nav-menus', menus);
              })
            );
        }
      })
    );
  }
}

export function initConfig(appConfigService: AppConfigService) {
  return () => appConfigService.SyncStaticData();
}
