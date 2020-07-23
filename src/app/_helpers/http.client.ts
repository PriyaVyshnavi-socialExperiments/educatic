import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IRequestOptions } from '../_models';

@Injectable({
  providedIn: 'root'
})


export class HttpService {
  private api = environment.apiBaseUrl;

  // Extending the HttpClient through the Angular DI.
  public constructor(public http: HttpClient) {
  }

  /**
   * GET request
   * @param endPoint it doesn't need / in front of the end point
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   * @returns Observable<T>
   */
  public Get<T>(endPoint: string, requestOptions?: IRequestOptions): Observable<T> {
    const options = {} as IRequestOptions;
    if ( requestOptions && requestOptions.headers ) {
        options.headers = requestOptions.headers;
    }
    return this.http.get<T>(this.api + endPoint, options);
  }

  /**
   * POST request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Post<T>(endPoint: string, params: object, requestOptions?: IRequestOptions): Observable<T> {
    const options = {} as IRequestOptions;
    options.body = params;
    if ( requestOptions && requestOptions.headers ) {
        options.headers = requestOptions.headers;
    }
    return this.http.post<T>(this.api + endPoint, params, options);
  }

  /**
   * PUT request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Put<T>(endPoint: string, params: object, requestOptions?: IRequestOptions): Observable<T> {
    const options = {} as IRequestOptions;
    options.body = params;
    if ( requestOptions && requestOptions.headers ) {
        options.headers = requestOptions.headers;
    }
    return this.http.put<T>(this.api + endPoint, params, options);
  }

  /**
   * DELETE request
   * @param endPoint end point of the api
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Delete<T>(endPoint: string, requestOptions?: IRequestOptions): Observable<T> {
    const options = {} as IRequestOptions;
    if ( requestOptions && requestOptions.headers ) {
        options.headers = requestOptions.headers;
    }
    return this.http.delete<T>(this.api + endPoint, options);
  }
}
