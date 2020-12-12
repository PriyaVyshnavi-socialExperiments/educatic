import { IAttendance } from './dashboard-attendance';
export interface IDashboardStudent {
    name: string;
    id: string; 
    classId: string;
    schoolId: string;
    city: string;
    gender: string;
    enrollmentDate: string;
}