import { QuestionType } from './question-type';

export interface IAssessment {
  id: string;
  createdBy: string;
  createdDate: Date;
  schoolId: string;
  classId: string;
  subjectName: string;
  assessmentTitle: string;
  assessmentDescription: string;
  active: boolean;
  assessmentQuestions: IQuestion[];
  studentAssessments: IStudentAssessment[];
}

export interface IStudentAssessment {
  id: string;
  assessmentId: string;
  studentName: string;
  studentId: string;
  schoolId: string;
  classId: string;
  assessmentAnswers: IAnswer[];
  createdDate: Date;
  active: boolean;
}

export interface ISubjectAssessment {
  subjectName: string;
  assessments: IAssessment[];
  length: number;
}

export interface IQuestion {
  id: string;
  questionDescription: string;
  questionOptions: {
    [key: number]: string;
  };
  questionType: QuestionType;
  shortAnswer: string;
  optionAnswer: number;
  active: boolean;
}

export interface IAnswer {
 questionId: string;
 attempts: number;
 optionAnswer: number;
 shortAnswer: string;
}

export interface IAssessmentShare {
  id: string;
  schoolId: string;
  classId: string;
  assessmentId: string;
  createdBy: string;
}

export interface IClassAssessment {
  classId: string;
  studentAssessments: IStudentAssessment[];
  length: number;
}