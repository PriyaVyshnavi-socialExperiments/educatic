export interface IQueueMessage {
    schoolId: string;
    classId: string;
    courseId: string;
    teacherId: string;
    studentId: string;
    pictureURLs: string[];
    pictureTimestamp?: Date;
    latitude: string;
    longitude: string;
}
