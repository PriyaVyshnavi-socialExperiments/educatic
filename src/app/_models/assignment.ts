
export interface IAssignment {
    id: string;
    createdBy: string;
    createdDate: Date,
    schoolId: string;
    classId: string;
    subjectName: string;
    assignmentName: string;
    assignmentDescription: string;
    assignmentURL: string;
    studentAssignments: string;
    studentAssignmentList: IStudentAssignment[],
    active: boolean;
    badgeToggle: boolean;
}

export interface IStudentAssignment {
    id: string;
    createdDate: Date;
    studentName: string;
    assignmentURL: string;
}

export interface ISubjectAssignmentList {
    key: string,
    assignment: IAssignment[];
    length: number,
}
