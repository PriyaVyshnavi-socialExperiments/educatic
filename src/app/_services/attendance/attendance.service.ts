import { BlobUploadsViewStateService } from '../../_services/azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../../_services/azure-blob/blob-shared-view-state.service';
import { OfflineService } from '../offline/offline.service';
import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AttendanceService extends OfflineService {

    constructor(
        private http: HttpService,
        public injector: Injector,
        private network: NetworkService,
        private blobUpload: BlobUploadsViewStateService,
        private blobShared: BlobSharedViewStateService,
    ) {
        super(injector);
    }

    public UploadImageFile(attendancePhoto: File) {
        this.blobShared.setContainer$ = 'attendance';
        this.blobShared.resetSasToken$ = true;
        return this.blobUpload.uploadFile(attendancePhoto);
      }

      public QueueBlobMessage(queueData: IQueueMessage) {
        return this.http.Post<any>('/queue/message', queueData);
      }
}