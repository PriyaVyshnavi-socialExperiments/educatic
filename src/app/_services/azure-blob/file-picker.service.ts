import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilePickerAdapter, FilePreviewModel } from 'ngx-awesome-uploader';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class FilePicker extends FilePickerAdapter {
    constructor(private http: HttpClient, private spinner: SpinnerVisibilityService) {
        super();
    }

    uploadFile(fileItem: FilePreviewModel): Observable<string | number> {
        const form = new FormData();
        form.append('file', fileItem.file);
        const api = 'https://demo-file-uploader.free.beeceptor.com';
        const req = new HttpRequest('POST', api, form, { reportProgress: true });
        return this.http.request(req)
            .pipe(
                map((res: HttpEvent<any>) => {
                    this.spinner.hide();
                    if (res.type === HttpEventType.Response) {
                        return res.body.id.toString();
                    } else if (res.type === HttpEventType.UploadProgress) {
                        // Compute and show the % done:
                        const UploadProgress = +Math.round((100 * res.loaded) / res.total);
                        return UploadProgress;
                    }
                })
            );
    }
    removeFile(fileItem: FilePreviewModel): Observable<any> {
        return of(true);
    }
}