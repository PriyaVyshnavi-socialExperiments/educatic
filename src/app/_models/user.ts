import { Role, IMenuItems, ISchool } from '.';

export interface IUser {
    id: string;
    defaultSchoolId: string;
    email: string;
    firstName: string;
    lastName: string;
    schoolId: string;
    role: Role;
    token?: string;
    forceChangePasswordNextLogin: boolean;
    menuItems: IMenuItems[];
    schools: ISchool[]
}