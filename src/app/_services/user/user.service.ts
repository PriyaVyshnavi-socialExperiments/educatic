import { Injectable } from '@angular/core';

import { IUser } from '../../_models';
import { HttpService } from '../http-client/http.client';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpService) { }

    getAll() {
        return this.http.Get<IUser[]>('/users');
    }

    getById(id: number) {
        return this.http.Get<IUser>(`/users/${id}`);
    }
}