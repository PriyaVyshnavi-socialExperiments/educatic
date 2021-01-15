export interface ICourseContent {
    id: string;
    schoolId: string;
    courseName: string;
    courseDescription: string;
    courseURL: string;
    thumbnailURL: string;
    courseCategory: string;
    courseLevel: string;
    courseAssessment: string;
    isTokenRequired: boolean;
    createdBy: string;
    active: boolean;
    isBlobUrl: boolean;
}

export interface ICategoryWiseContent {
    [courseCategory: string]: ICourseContent[];
}

export interface ICategoryContentList {
    key: string,
    content: ICourseContent[];
    length: number,
    level: boolean,
}
