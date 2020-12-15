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
}

export interface IAnswer {
 questionId: string;
 attempts: number;
 optionAnswer: number;
 shortAnswer: string;
}