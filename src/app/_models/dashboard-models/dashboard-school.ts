import { IAttendance } from './dashboard-attendance';
import { IDashboardClassRoom } from './dashboard-classroom'
import { IDashboardTeacher } from './dashboard-teacher';
export interface IDashboardSchool {
    name: string;
    id: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    latitude: string;
    longitude: string;
    classRooms: IDashboardClassRoom[];
    teachers: IDashboardTeacher[];
    averageAttendance: number;
}