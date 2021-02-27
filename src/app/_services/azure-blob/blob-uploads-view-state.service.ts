import { Injectable } from '@angular/core';
import { from, OperatorFunction, BehaviorSubject } from 'rxjs';
import { map, mergeMap, startWith, switchMap, tap, take } from 'rxjs/operators';
import { BlobContainerRequest, BlobItemUpload } from './azure-storage';
import { BlobSharedViewStateService } from './blob-shared-view-state.service';
import { BlobStorageService } from './blob-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BlobUploadsViewStateService {

  get uploadQueue$() {
    return this.uploadQueueInner$
      .asObservable()
      .pipe(mergeMap(files => from(files)));
  }

  constructor(
    private blobStorage: BlobStorageService,
    private blobState: BlobSharedViewStateService
  ) {}
  // CHANGED TO BEHAVIOR SUBJECT
  private uploadQueueInner$ = new BehaviorSubject<FileList>(undefined);

  uploadedItems$ = this.uploadQueue$.pipe(
    mergeMap(file => this.uploadFile(file)),
    this.blobState.scanEntries()
  );

  uploadItems(files: FileList): void {
    this.uploadQueueInner$.next(files);
  }


  // For uploading offline website director and preserving directory structure 
  uploadedOfflineWebsite$ = this.uploadQueue$.pipe(
    mergeMap(file => this.uploadFile(file, (file as any).webkitRelativePath)),
    this.blobState.scanEntries()
  );

  public uploadFile = (file: File, fileName?: string) =>
    this.blobState.getStorageOptionsWithContainer().pipe(
      take(1),
      switchMap(options =>
        this.blobStorage
          .uploadToBlobStorage(file, {
            ...options,
            filename: fileName? fileName : file.name
          })
          .pipe(
            this.mapUploadResponse(file, options),
            this.blobState.finaliseBlobChange(options.containerName)
          )
      )
    );

  private mapUploadResponse = (
    file: File,
    options: BlobContainerRequest
  ): OperatorFunction<number, BlobItemUpload> => source =>
    source.pipe(
      map(progress => ({
        filename: file.name,
        containerName: options.containerName,
        progress: parseInt(((progress / file.size) * 100).toString(), 10)
      })),
      startWith({
        filename: file.name,
        containerName: options.containerName,
        progress: 0
      })
    );
}
