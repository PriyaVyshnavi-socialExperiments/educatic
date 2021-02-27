import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlobStorageRequest } from './azure-storage';


@Injectable({
  providedIn: 'root'
})
export class SasGeneratorService {
  constructor(private http: HttpClient) {}

  getSasToken(containerName): Observable<BlobStorageRequest> {
    return this.http.get<BlobStorageRequest>(
      `${environment.apiBaseUrl}/azure/${containerName}/uri`
    );
  }

  getOfflineWebsitesSASToken(): Observable<BlobStorageRequest> {
    return of({
      storageUri: "https://offlinewebsitestorage.blob.core.windows.net/",
      storageAccessToken: "?sv=2019-10-10&si=%24web-177E4948CF4&sr=c&sig=uEOWGGIov4ZtfXyMQhV8p22JoZxiNaogKcXLkDO%2FYs4%3D"
    })
  }
}
