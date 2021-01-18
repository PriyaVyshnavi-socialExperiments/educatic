import { IntersectionObserverHooks, Attributes } from 'ng-lazyload-image';
import { StudentService } from '../_services/student/student.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AssessmentService } from '../_services/assessment/assessment.service';


@Injectable({
    providedIn: 'root'
})
export class LazyLoadImageHooks extends IntersectionObserverHooks {
    constructor(
        private studentService: StudentService,
        private assessmentService: AssessmentService) {
        super();
    }

    loadImage({ imagePath, decode, errorImagePath }: Attributes) {
        if(decode) {
            return [imagePath];
        } else if (typeof imagePath === 'object') {
            return [URL.createObjectURL(imagePath)];
        } else if (imagePath === 'default') {
            return ['assets/images/avatar.svg'];
        } else if(errorImagePath==='assessment') {
            return this.assessmentService.GetAssessmentImage(imagePath).pipe(
                map(blob => blob.url)
            );
        }
        return this.studentService.GetStudentPhoto(imagePath).pipe(
            map(blob => blob.url)
        );
    }
}