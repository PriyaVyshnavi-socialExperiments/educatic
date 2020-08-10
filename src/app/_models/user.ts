import { Role } from '.';

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    schoolId: string;
    role: Role;
    token?: string;
}