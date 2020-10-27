
export interface IAssignment {
    id: string;
    createdBy: string;
    schoolId: string;
    classId: string;
    subjectName: string;
    assignmentName: string;
    assignmentDescription: string;
    assignmentURL: string;
    studentAssignments: string;
    active: boolean;
}

export interface IStudentAssignment {
    id: string;
    studentName: string;
    assignmentURL: string;
}
