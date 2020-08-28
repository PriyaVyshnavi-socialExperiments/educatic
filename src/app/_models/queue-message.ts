export interface IQueueMessage {
    location: string;
    latLong: string;
    schoolId: string;
    classId: string;
    teacherId: string;
    studentId: string;
    pictureURLs: string[];
    pictureTimestamp: string;
}