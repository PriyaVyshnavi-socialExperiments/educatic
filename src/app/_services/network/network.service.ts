import { Injectable } from '@angular/core';
import { ReplaySubject, merge, of, fromEvent, Observable } from 'rxjs';
import { mapTo, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Events } from '../events/events.service';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    /**
     * ReplaySubject with only the latest result indicating if
     * the network is up/down.
     */
    public online: ReplaySubject<boolean> = new ReplaySubject( 1 );

    private initialized = false;

    /**
     * Initialize the listeners for both the navigator.onLine and
     * the window events to update `this.online`.
     */
    constructor(
        private events: Events,
    ) {
        merge(
            of( navigator.onLine ),
            fromEvent( window, 'online' ).pipe( mapTo( true ) ),
            fromEvent( window, 'offline' ).pipe( mapTo( false ) ),
            Observable.create( ( observer ) => this.events.subscribe( 'online', () => observer.next( true ) ) ),
            Observable.create( ( observer ) => this.events.subscribe( 'offline', () => observer.next( false ) ) ),
        ).pipe(
            debounceTime( 200 ),
            distinctUntilChanged(),
        ).subscribe( ( result ) => {
            if ( this.initialized || ( !this.initialized && !result ) ) {
                this.online.next( result );
            }

            this.initialized = true;
        } );

    }
}