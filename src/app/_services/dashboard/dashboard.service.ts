import { Injectable } from '@angular/core';
import { schools } from '../../components/variables/schools';
import { HttpService } from '../http-client/http.client';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  schools = schools;

  constructor(
    http: HttpService,
  ) { }

  public getOfflineData() {

  }

  public getData() {
    return this.schools; 
  }

  public formatData() {

  }
}
