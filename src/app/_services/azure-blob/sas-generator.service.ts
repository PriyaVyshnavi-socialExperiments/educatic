import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
