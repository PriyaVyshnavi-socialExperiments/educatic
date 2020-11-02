import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilePickerAdapter, FilePreviewModel } from 'ngx-awesome-uploader';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SasGeneratorService } from './sas-generator.service';
import { BlobUploadsViewStateService } from './blob-uploads-view-state.service';
import { BlobSharedViewStateService } from './blob-shared-view-state.service';
import { BlobDownloadsViewStateService } from './blob-downloads-view-state.service';
import { ContentHelper } from 'src/app/_helpers/image-helper';

@Injectable({
    providedIn: 'root'
})

export class FilePicker extends FilePickerAdapter {
    public blobFileName: string;

    constructor(
        private blobUpload: BlobUploadsViewStateService,
        private blobShared: BlobSharedViewStateService,
    ) {
        super();
    }

    uploadFile(fileItem: FilePreviewModel): Observable<string | number> {
        const form = new FormData();
        form.append('file', fileItem.file);
        return this.UploadImageFile(fileItem.file, fileItem.fileName)
            .pipe(
                map((res: any) => {
                    const UploadProgress = res.progress;
                    return UploadProgress === 100 ? 'Sucess' : UploadProgress;
                })
            );
    }

    public UploadImageFile(studentBlobData, filename) {
        this.blobShared.setContainer$ = 'coursecontent';
        this.blobShared.resetSasToken$ = true;
        filename = this.blobFileName + '/' + filename;
        return this.blobUpload.uploadFile(studentBlobData, filename);
    }

    removeFile(fileItem: FilePreviewModel): Observable<any> {
        return of(true);
    }
}