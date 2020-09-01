import { Role, IMenuItems, ISchool } from '.';

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    token?: string;
    forceChangePasswordNextLogin: boolean;
    menuItems: IMenuItems[];
    schools: ISchool[];
    defaultSchool: ISchool;
}