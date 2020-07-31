import { Observable } from 'rxjs';

/**
 * Defines an interface for a promise with a cancel method.
 */
export interface ICancelableObservable<T> extends Observable<T> {
    cancel: () => void;
}
