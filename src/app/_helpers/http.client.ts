import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { IRequestOptions } from '../_models/request-options';
import { Events } from '../_services/events/events.service';
import { catchError } from 'rxjs/operators';
import { ICancelableObservable } from '../_models/cancelable-observable';

@Injectable({
  providedIn: 'root'
})


export class HttpService {
  private api = environment.apiBaseUrl;

  /** Event Emitter which fires when the authorization is denied due to 401 */
  private authFailed: EventEmitter<any> = new EventEmitter();

  // Extending the HttpClient through the Angular DI.
  public constructor(
    public http: HttpClient,
    private events: Events) {
  }

  /**
   * GET request
   * @param endPoint it doesn't need / in front of the end point
   * @param options options of the request like headers, body, etc.
   * @param api use if there is needed to send request to different back-end than the default one.
   * @returns Observable<T>
   */
  public Get<T>(endPoint: string, requestOptions?: IRequestOptions): ICancelableObservable<T> {
    return this.Request('GET', endPoint, requestOptions);
  }

  /**
   * POST request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Post<T>(endPoint: string, params: object, requestOptions?: IRequestOptions): ICancelableObservable<T> {
    return this.Request('POST', endPoint, params, requestOptions);
  }

  /**
   * PUT request
   * @param endPoint end point of the api
   * @param params body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Put<T>(endPoint: string, params: object, requestOptions?: IRequestOptions): ICancelableObservable<T> {
    return this.Request('PUT', endPoint, params, requestOptions);
  }

  /**
   * DELETE request
   * @param endPoint end point of the api
   * @param options options of the request like headers, body, etc.
   * @returns Observable<T>
   */
  public Delete<T>(endPoint: string, requestOptions?: IRequestOptions): ICancelableObservable<T> {
    return this.Request('DELETE', endPoint, requestOptions);
  }

  /**
   * Makes an HTTP request and returns an observable which wraps the HTTP observable
   * allowing management of token and loading indicator when requests are made.
   */

  private Request(method: string, endPoint: string, params?: object, requestOptions?: IRequestOptions)
  : ICancelableObservable<any>  {
    const options = {} as IRequestOptions;
    if (requestOptions && requestOptions.headers) {
      options.headers = requestOptions.headers;
    }
    const httpRequest = new HttpRequest(method, this.api + endPoint, params, options);

    let request;
    const observable = Observable.create((observer) => {
       request = this.http.request(httpRequest)
        .subscribe(
          (event: HttpEvent<any>) => {
            if (event.type !== HttpEventType.Response) {
              return;
            }

            /**
             * Some browsers don't update their network status
             * so we use the API replies as a method to detect
             * network status.
             */
            this.events.subscribe('online', () => observer.next(true));

            observer.next(event.body);
            observer.complete();
          },
          (err) => {

            /**
             * If an error occurs fire an event on the observer. If the error
             * is a 401 then fire an additional event on the public `authFailed`
             * item.
             */
            switch (err.status) {
                case 0:

                    /** Publish an offline event to update network status. */
                    this.events.subscribe('offline', () => observer.next(false));
                    break;
                case 401:
                    this.authFailed.next(err);
                    observer.error(err);
                    break;
                default:
                    observer.error(err);
                    break;
            }
        },
        );
    });

    observable.cancel = () => request.unsubscribe();
    return observable;
  }

  private errorHandler(error: HttpErrorResponse) {

    /**
     * If an error occurs fire an event on the observer. If the error
     * is a 401 then fire an additional event on the public `authFailed`
     * item.
     */
    switch (error.status) {
      case 0:
        /** Publish an offline event to update network status. */
        Observable.create((observer) => this.events.subscribe('offline', () => observer.next(false)));
        break;
      case 401:
        this.authFailed.next(error);
        break;
      default:
        break;
    }

    return Observable.throw(error.message);
  }
}
