export enum OfflineSyncURL {
    UserProfile = '/user/profile',
    School = '/school',
    Teacher = '/teacher',
    Student = '/student',
    ClassRoom = '/class-room',
    CourseContent= '/content/create'
}

export class OfflineSync {
    public static Data = [{
        table: 'courseContent',
        key: 'course-content',
    }];
}