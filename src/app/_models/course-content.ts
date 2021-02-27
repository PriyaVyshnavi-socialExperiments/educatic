import { IStoredContentRequest } from "./offline-storage-request";

export interface ICourseContent {
    id: string;
    schoolId: string;
    courseName: string;
    courseDescription: string;
    courseURL: string;
    thumbnailURL: string;
    courseCategory: string;
    categoryName: string;
    courseLevel: string;
    courseAssessment: string;
    isTokenRequired: boolean;
    createdBy: string;
    active: boolean;
    isBlobUrl: boolean;
    isOffline: boolean;
    type: string;
    saveProgress: number;
    contentRequest?: IStoredContentRequest;
}

export interface ICategoryWiseContent {
    [courseCategory: string]: ICourseContent[];
}

export interface ICategoryContentList {
    key: string,
    content: ICourseContent[];
    length: number,
    level: boolean,
    isOffline?: boolean
}
