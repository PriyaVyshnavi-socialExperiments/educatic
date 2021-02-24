import { Injectable, Injector } from '@angular/core';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize, map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import * as blobUtil from 'blob-util';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { OfflineService } from '../offline/offline.service';
import { IStoredContentRequest, IStoredRequest } from '../../_models';
import { environment } from '../../../environments/environment';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { ContentHelper } from '../../_helpers/content-helper';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncManagerService extends OfflineService {

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    public injector: Injector,
    private blobUpload: BlobUploadsViewStateService,
    private blobShared: BlobSharedViewStateService,
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
    const operationsToSync = [];

    for (const operation of operations) {
      const httpRequest = new HttpRequest(operation.Type, environment.apiBaseUrl + operation.URL, operation.Data);
      const oneObs = this.http.request(httpRequest);
      operationsToSync.push(oneObs);
      if (operation.Data?.contentRequest) {
        operationsToSync.push(this.storeContentRequest(operation.Data?.contentRequest));
      }
    }

    // Send out all local events and return once they are finished
    return forkJoin(operationsToSync);
  }

  private storeContentRequest(contentDetails: IStoredContentRequest) {
    return from(this.GetOfflineData(contentDetails.tableName, contentDetails.key)).pipe(
      switchMap((storedContent) => {
        const blobData = blobUtil.base64StringToBlob(storedContent, contentDetails.contentType);
        const fileData = ContentHelper.blobToFile(blobData, contentDetails.contentURL);
        return this.UploadFileContent(fileData, contentDetails.containerName)
      })
    );
  }

  public getOfflineContent(tableName: string, key: string) {
    return from(this.GetOfflineData(tableName, key)).pipe(
      map(response => {
        if (response && response.length > 0) {
          return response;
        } else {
          return of(false);
        }
      })
    );
  }

  private UploadFileContent(contentFile: File, containerName: string) {
    this.blobShared.setContainer$ = containerName;
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(contentFile);
  }
}