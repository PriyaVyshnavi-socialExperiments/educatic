export enum OfflineSyncURL {
    UserProfile = '/user/profile',
    School = '/school',
    Teacher = '/teacher',
    Student = '/student',
    ClassRoom = '/class-room'
}

export class OfflineSync {
    public static Data = [{
        table: 'courseContent',
        key: 'course-content',
    }];
}