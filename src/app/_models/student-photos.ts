export interface IStudentPhoto {
    id: string;
    schoolId: string;
    classId: string;
    blobData: File;
    format: string;
    imageName: string;
    sequenceId: number;
}