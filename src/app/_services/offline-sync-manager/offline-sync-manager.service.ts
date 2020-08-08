import { Injectable, Injector } from '@angular/core';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { OfflineService } from '../offline/offline.service';
import { IStoredRequest } from '../../_models';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class OfflineSyncManagerService extends OfflineService {

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    public injector: Injector
  ) {
    super(injector);
  }

  public CheckForEvents(): Observable<any> {
    return from(this.GetOfflineData('OfflineSyncRequests', 'offline-data')).pipe(
      switchMap(storedOperations => {
        const storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              this.RemoveOfflineData('OfflineSyncRequests', 'offline-data');
            })
          );
        } else {
          console.log('No local data to sync');
          return of(false);
        }
      })
    )
  }

  public async StoreRequest(url: string, type: string, data: any) {
    const currentAction: IStoredRequest = {
      URL: url,
      Type: type,
      Data: data,
      Time: new Date().getTime(),
      Id: data.id
    };

    const storedOperations = await this.GetOfflineData('OfflineSyncRequests', 'offline-data');
    let storedObj = JSON.parse(storedOperations);
    console.log("storedObjOfflineData: ", storedObj);
    if (storedObj) {
      storedObj = storedObj.filter((obj) => {
        return obj.Id !== currentAction.Id;
      });
      storedObj.push(currentAction);
    }
    else {
      storedObj = [currentAction];
    }
    return this.SetOfflineData('OfflineSyncRequests', 'offline-data', JSON.stringify(storedObj));
  }

  private sendRequests(operations: IStoredRequest[]) {
    const obs = [];

    for (const op of operations) {
      console.log('Make one request: ', op);
      const httpRequest = new HttpRequest(op.Type, environment.apiBaseUrl + op.URL, op.Data);
      const oneObs = this.http.request(httpRequest);
      obs.push(oneObs);
    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }
}