import { IAttendance } from './dashboard-attendance';
import { IDashboardStudent } from './dashboard-student';
export interface IDashboardClassRoom {
    name: string;
    id: string;
    school: string;
    schoolId: string;
    city: string;
    classDivision: string;
    students: IDashboardStudent[];
    numTeachers: number;
    averageAttendance: number;
}