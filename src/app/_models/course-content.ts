export interface ICourseContent {
    id: string;
    courseName: string;
    courseDescription: string;
    courseURL: string;
    thumbnailURL: string;
    categoryName: string;
    isTokenRequired: boolean;
    createdBy: string;
    active: boolean;
}

export interface ICategoryWiseContent {
    [categoryName: string]: ICourseContent[];
}

export interface ICategoryContentList {
    key: string,
    content: ICourseContent[];
    length: number,
}
