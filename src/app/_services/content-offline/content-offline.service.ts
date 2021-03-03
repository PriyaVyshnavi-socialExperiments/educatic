import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BlobDownloadsViewStateService } from '../azure-blob/blob-downloads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { OfflineService } from '../offline/offline.service';
import { switchMap, tap } from 'rxjs/operators';
import { concat, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentOfflineService extends OfflineService {

  downloadURL: string;
  httpWithoutInterceptor: HttpClient;
  public progress: number = 0;

  constructor(
    private blobShared: BlobSharedViewStateService,
    private blobDownload: BlobDownloadsViewStateService,
    public injector: Injector,
    private httpBackend: HttpBackend,
  ) {
    super(injector);
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);
  }

  downloadContent(content: any, containerName: string, progress?: any) {
   return from( this.downloadBlob(content.courseURL, containerName, progress)
    .pipe(
      tap((e)=> {console.log("downloadBlob: ", e)}),
      switchMap((data) => this.getRequest(data.url))
    ))
  }

  public getOfflineStatusIcon(isOffline: boolean): "close-circle" | "cloud-done" | "cloud-download" {
    return isOffline ? "cloud-done" : "cloud-download";
}

  private getRequest(endpoint: string) {
    return this.httpWithoutInterceptor.get(endpoint, {
      responseType: 'blob',
      reportProgress: true,
      observe: "events"
    });
  }

  private downloadBlob(contentURL, containerName, progress?: any) {
    this.blobShared.setContainer$ = containerName;
    this.blobShared.resetSasToken$ = true;
    return this.blobDownload.downloadFile(contentURL, progress);
  }
}
