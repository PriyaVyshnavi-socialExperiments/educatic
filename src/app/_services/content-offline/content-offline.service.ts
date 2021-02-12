import { HttpBackend, HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BlobDownloadsViewStateService } from '../azure-blob/blob-downloads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { OfflineService } from '../offline/offline.service';
import * as blobUtil from 'blob-util';
import { CourseContentService } from '../course-content/course-content.service';
import { switchMap } from 'rxjs/operators';

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
    private courseContentService: CourseContentService,
  ) {
    super(injector);
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);
  }

  offlineContent(content: any, containerName: string) {
   return this.downloadContent(content.courseURL, containerName)
    .pipe(
      switchMap((data) => this.getRequest(data.url))
    )
    
    // .subscribe((data) => {

    //   this.getRequest(data.url).subscribe((event) => {
    //     if (event.type === HttpEventType.DownloadProgress) {
    //       this.progress = Math.round(100 * event.loaded / event.total);
    //       console.log("download progress: ", this.progress);
    //     }
    //     if (event.type === HttpEventType.Response) {
    //       this.progress = 0;
    //       const blob = event.body;
    //        blobUtil. blobToBase64String(blob).then(streamData => {

    //         content.isOffline = true;
    //         content.offlineData = streamData;
    //         content.type = blob.type;
    //         this.courseContentService.UpdateCourseContentOfflineList(content, content.id);

    //       // this.SetOfflineData('course-content', content.id, tmp);
    //       // this.GetOfflineData('course-content', content.id).then(t => {
    //       //   const a = blobUtil.base64StringToBlob(t, blob.type);

    //       //   content.isOffline = true;
    //       //   content.offlineData = streamData;
    //       //   //window.URL.createObjectURL(a);
    //       //   this.courseContentService.UpdateCourseContentOfflineList(content, content.id);
    //       // });
    //     });
    //     }
    //   });
    // });
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

  private downloadContent(contentURL, containerName) {
    this.blobShared.setContainer$ = containerName;
    this.blobShared.resetSasToken$ = true;
    return this.blobDownload.downloadFile(contentURL);
  }
}
