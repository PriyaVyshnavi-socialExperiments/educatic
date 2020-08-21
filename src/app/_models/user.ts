import { Role, IMenuItems, ISchool } from '.';
import { IClassRoom } from './class-room';

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
    classRooms: IClassRoom[];
    schoolId: string;
    classRoomId: string;
}