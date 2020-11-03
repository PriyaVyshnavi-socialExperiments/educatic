
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
    studentAssignments: IStudentAssignment[],
    active: boolean;
    badgeToggle: boolean;
}

export interface IStudentAssignment {
    id: string;
    assignmentId: string;
    createdDate: Date;
    studentId: string,
    studentName: string;
    assignmentURL: string;
    schoolId: string;
}

export interface ISubjectAssignmentList {
    key: string,
    assignment: IAssignment[];
    length: number,
}
