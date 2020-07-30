import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser } from '../_models';
import { HttpService } from '../_helpers';

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