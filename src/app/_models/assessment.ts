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
  assessmentAnswers: IAnswer[];
  createdDate: Date;
  attempts: number;
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
  answer: string;
}

export interface IAnswer {
 questionId: string;
 attempts: number;
 answerKey: number;
 attemptAnswer: string;
}