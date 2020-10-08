import { EventEmitter, Injectable } from '@angular/core';
import { ServiceEvent } from 'src/app/_models/service-event';
@Injectable({
    providedIn: 'root'
})
export class RefreshServerService {

    public onChange: EventEmitter<ServiceEvent> = new EventEmitter<ServiceEvent>();

    public Refresh(message: string, eventId: number) {
        this.onChange.emit({message, eventId});
    }
}