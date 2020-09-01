import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private dataShareSubject = new BehaviorSubject(null);
  constructor() { }

  public unsubscribe() {
    this.dataShareSubject.next(null);
  }

  public setData(data) {
    this.dataShareSubject.next(data);
  }

  public getData() {
    return this.dataShareSubject.asObservable();
  }

}
