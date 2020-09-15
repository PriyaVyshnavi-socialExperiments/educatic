export interface IStudent {
    schoolId: string;
    classId: string;
    id: string;
    firstName: string;
    lastName: string;
    enrolmentNo: string;
    role: string;
    acceptTerms: boolean;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    latitude: string;
    longitude: string;
    syncDateTime?: Date;
    profileStoragePath: string;
    createdBy: string;
    myProfile: string[];
}