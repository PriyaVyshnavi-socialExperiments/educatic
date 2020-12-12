import { Role, IMenuItems, ISchool } from '.';
import { ICourseContent } from './course-content';

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
    courseContent?: ICourseContent[];
    classId?: string;
    assessmentCategory: string[];
}