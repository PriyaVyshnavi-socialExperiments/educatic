import { IAttendance } from './dashboard-attendance';
import { IDashboardSchool } from './dashboard-school';
export interface IDashboardCity {
    name: string, 
    id: string, 
    schools: IDashboardSchool[],
}