import { IClassRoom } from '.';

export interface ISchool {
    id: string;
    name: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    latitude: string;
    longitude: string;
    syncDateTime?: Date;
    createdBy: string;
    classRooms: IClassRoom[];
}