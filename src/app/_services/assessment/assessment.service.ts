import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { concat, forkJoin, from, Observable, of } from 'rxjs';
import * as blobUtil from 'blob-util';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';

import {
    catchError,
    finalize,
    groupBy,
    map,
    mergeMap,
    reduce,
    tap,
    toArray
} from 'rxjs/operators';
import {
    IAssessment,
    IAssessmentShare,
    IQuestion,
    IStudentAssessment,
    ISubjectAssessment
} from 'src/app/_models/assessment';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { BlobDownloadsViewStateService } from '../azure-blob/blob-downloads-view-state.service';

@Injectable({ providedIn: 'root' })
export class AssessmentService extends OfflineService {

    // tslint:disable-next-line:max-line-length
    constructor(private http: HttpService, public injector: Injector,
        private network: NetworkService,
        private blobUpload: BlobUploadsViewStateService,
        private blobShared: BlobSharedViewStateService,
        private blobDownload: BlobDownloadsViewStateService,) {
        super(injector);
    }


    public CreateUpdateAssessment(assessment: IAssessment) {
        if (!assessment.id) {
            assessment.id = Guid.create().toString();
        }
        return this.http.Post<Response>('/assessment/update', assessment).pipe(map(response => {
            return response;
        }), finalize(async () => {
            await this.UpdateAssessmentOfflineList(assessment);
        }));
    }

    public SubmitStudentAssessment(assessment: IStudentAssessment) {
        if (!assessment.id) {
            assessment.id = Guid.create().toString();
        }
        return this.http.Post<Response>('/assessment/student/update', assessment).pipe(map(response => {
            return response;
        }), finalize(() => { // this.UpdateAssessmentOfflineList(assessment);
        }));
    }

    public CreateUpdateAssessmentQuestion(question: IQuestion, assessmentId: string, subjectName: string, questionFile?: File[]) {

        const assessmentQuestion = this.http.Post<Response>(`/assessment/question/${assessmentId}/update`, question).pipe(map(response => {
            return response;
        }), finalize(async () => {
            await this.UpdateAssessmentQuestionOffline(question, assessmentId, subjectName);
        }));
        if (questionFile) {
            return concat(this.UploadAssessment(questionFile), assessmentQuestion);
        } else {
            return assessmentQuestion;
        }
    }

    public GetAssessments(schoolId: string, classId?: string, studentId?: string) {
        if (!this.network.IsOnline()) {
            return this.GetOfflineAssessments();
        } else {
            const url = classId ? `/assessments/${schoolId}/${classId}/${studentId}` : `/assessments/${schoolId}`;
            return this.http.Get<IAssessment[]>(url).pipe(map(res => this.GetSubjectWiseAssessments(res)), tap(response => {
                if (response) {
                    response.subscribe((data) => {
                        this.SetOfflineData('Assessment', 'assessments', data);
                    });
                }
            }), catchError(() => {
                return this.GetOfflineAssessments();
            }));
        }
    }

    public GetSubjectWiseAssessments(assessments: IAssessment[]) {
        return from(assessments)
            .pipe(groupBy(a => a.subjectName?.toLowerCase()),
                mergeMap(group => group
                    .pipe(reduce((asm, cur) => {
                        asm.assessments.push(cur);
                        asm.length = asm.assessments.length;
                        return asm;
                    }, {
                        subjectName: group.key,
                        assessments: [],
                        length: 0
                    } as ISubjectAssessment))), toArray());
    }

    public AssessmentShare(assessmentShare: IAssessmentShare) {
        if (!assessmentShare.id) {
            assessmentShare.id = Guid.create().toString();
        }
        return this.http.Post<any>('/assessment/share', assessmentShare).pipe(map(response => {
            return response;
        }));
    }

    // public async getAssessment(assessmentId: string) {
    // const data = await this.GetOfflineData('Assessment', 'assessments');
    // const assessments = data ? data as ISubjectAssessment[] : [];
    // return assessments.find((s) => s.id === assessmentId);
    // }

    private async UpdateAssessmentOfflineList(assessment: IAssessment) {
        const data = await this.GetOfflineData('Assessment', 'assessments');
        const subjectWiseAssessments = data ? data as ISubjectAssessment[] : [];

        const filterSubjectAssessments = subjectWiseAssessments.filter((cc) => {
            return cc.subjectName !== assessment.subjectName;
        });

        // tslint:disable-next-line:max-line-length
        const filterSubjectAssessment = subjectWiseAssessments.find((s) => s.subjectName.toLowerCase() === assessment.subjectName.toLowerCase());

        if (filterSubjectAssessment) {
            const filterAssessment = filterSubjectAssessment.assessments.find((s) => s.id === assessment.id);
            const filteredAssessments = filterSubjectAssessment.assessments.filter((cc) => {
                return cc.id !== assessment.id;
            });

            filteredAssessments.unshift(assessment);
            const subjectWise = {
                subjectName: assessment.subjectName,
                length: filteredAssessments.length + 1
            } as ISubjectAssessment
            subjectWise.assessments = [...filteredAssessments];
            filterSubjectAssessments.unshift(subjectWise);
        } else {
            const subjectWise = {
                subjectName: assessment.subjectName,
                length: 1,
                assessments: []
            } as ISubjectAssessment
            subjectWise.assessments.unshift(assessment);
            filterSubjectAssessments.unshift(subjectWise);
        }
        await this.SetOfflineData('Assessment', 'assessments', filterSubjectAssessments);
    }

    private async UpdateAssessmentQuestionOffline(question: IQuestion, assessmentId: string, subjectName: string) {
        const data = await this.GetOfflineData('Assessment', 'assessments');
        const assessments = data ? data as ISubjectAssessment[] : [];
        const offlineAssessments = assessments.find((s) => s.subjectName === subjectName)?.assessments;
        const assessmentStored = offlineAssessments.find((s) => s.id === assessmentId);

        let assessmentQuestionList = assessmentStored.assessmentQuestions?.filter((cc) => {
            return cc.id !== question.id;
        });

        if (!assessmentQuestionList) {
            assessmentQuestionList = [];
        }
        assessmentQuestionList.unshift(question);
        assessmentStored.assessmentQuestions = [...assessmentQuestionList];
        await this.UpdateAssessmentOfflineList(assessmentStored);
    }

    public GetOfflineAssessments() {
        return from(this.GetOfflineData('Assessment', 'assessments')).pipe(map(response => {
            if (response && response.length > 0) {
                return of(response as ISubjectAssessment[]);
            } else {
                return of([]);
            }
        }));
    }

    private UploadAssessment(assessmentQuestion: File[]) {
        this.blobShared.setContainer$ = 'assessment';
        this.blobShared.resetSasToken$ = true;

        let observables: Observable<Object>[] = [];
        assessmentQuestion.forEach((file) => {
            observables.push(this.blobUpload.uploadFile(file));
        })
        return forkJoin(observables);
    }

    public GetAssessmentImage(imageURL) {
        this.blobShared.setContainer$ = 'assessment';
        this.blobShared.resetSasToken$ = true;
        return this.blobDownload.downloadFile(imageURL);
    }

}
