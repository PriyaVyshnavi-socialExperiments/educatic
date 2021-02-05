import { Injectable, Injector } from '@angular/core';
import { BlobDownloadsViewStateService } from '../azure-blob/blob-downloads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class ContentOfflineService extends OfflineService{

  downloadURL: string;

  constructor(
    private blobShared: BlobSharedViewStateService,
    private blobDownload: BlobDownloadsViewStateService,
    public injector: Injector,
  ) {
    super(injector);
   }

   offlineContent(contentURL: string, containerName: string) {
    this.downloadContent(contentURL, containerName).subscribe((data) => {
      console.log("FileData: ", data);
    })
   }

   private downloadContent(contentURL, containerName) {
    this.blobShared.setContainer$ = containerName;
    this.blobShared.resetSasToken$ = true;
    return this.blobDownload.downloadFile(contentURL);
  }
}
