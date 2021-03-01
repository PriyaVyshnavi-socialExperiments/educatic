import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  Subject
} from 'rxjs';
import {
  filter,
  finalize,
  map,
  scan,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import {
  BlobContainerRequest,
  BlobItem,
  BlobStorageRequest,
  Dictionary
} from './azure-storage';
import { BlobStorageService } from './blob-storage.service';
import { SasGeneratorService } from './sas-generator.service';

@Injectable({
  providedIn: 'root'
})
export class BlobSharedViewStateService {
  private selectedContainerInner$ = new BehaviorSubject<string>(undefined);
  // CHANGED THIS FROM SUBJECT TO BEHVAVIORSUBJECT 
  private sasToken$ = new BehaviorSubject<BlobStorageRequest>(undefined);

  containers$ = this.getStorageOptions().pipe(
    switchMap(options => this.blobStorage.getContainers(options))
  );

  itemsInContainer$ = this.selectedContainer$.pipe(
    filter(containerName => !!containerName),
    switchMap(containerName =>
      this.getStorageOptions().pipe(
        switchMap(options =>
          this.blobStorage.listBlobsInContainer({
            ...options,
            containerName
          })
        )
      )
    )
  );

  // List the root blobs (For offline website service)
  rootItemsInContainer$ = this.selectedContainer$.pipe(
    filter(containerName => !!containerName),
    switchMap(containerName =>
      this.getStorageOptions().pipe(
        switchMap(options =>
          this.blobStorage.listRootBlobsInContainer({
            ...options,
            containerName
          })
        )
      )
    )
  );

  get selectedContainer$() {
    return this.selectedContainerInner$.asObservable();
  }

  set setContainer$(containerName) {
    this.selectedContainerInner$.next(containerName);
  }

  set resetSasToken$(isReset: boolean) {
    if (isReset) {
      this.sasGenerator.getSasToken(this.selectedContainerInner$.value).subscribe((token) => {
        this.sasToken$.next(token);
      })
    } else {
      this.sasToken$.next(undefined);
    }
  }

  /*
    Specific for offline websites
  */
  set resetOfflineWebsitesSasToken$(isReset: boolean) {
    if (isReset) {
      this.sasGenerator.getOfflineWebsitesSASToken().subscribe((token) => {
        this.sasToken$.next(token);
      })
    } else {
      this.sasToken$.next(undefined);
    }
  }

  constructor(
    private sasGenerator: SasGeneratorService,
    private blobStorage: BlobStorageService
  ) { }

  getContainerItems(containerName: string): void {
    this.selectedContainerInner$.next(containerName);
  }

  finaliseBlobChange = <T>(
    containerName: string
  ): MonoTypeOperatorFunction<T> => source =>
      source.pipe(
        finalize(
          () =>
            this.selectedContainerInner$.value === containerName &&
            this.selectedContainerInner$.next(containerName)
        )
      );

  scanEntries = <T extends BlobItem>(): OperatorFunction<T, T[]> => source =>
    source.pipe(
      map(item => ({
        [`${item.containerName}-${item.filename}`]: item
      })),
      scan<Dictionary<T>>(
        (items, item) => ({
          ...items,
          ...item
        }),
        {}
      ),
      map(items => Object.values(items))
    );

  getStorageOptionsWithContainer(): Observable<BlobContainerRequest> {
    return this.getStorageOptions().pipe(
      withLatestFrom(this.selectedContainer$),
      map(([options, containerName]) => ({ ...options, containerName }))
    );
  }

  private getStorageOptions(): Observable<BlobStorageRequest> {
    return this.sasToken$;
  }
}
