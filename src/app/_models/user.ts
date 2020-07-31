import { Role } from '.';

export interface IUser {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    token?: string;
}