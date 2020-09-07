import { IntersectionObserverHooks, Attributes } from 'ng-lazyload-image';
import { StudentService } from '../_services/student/student.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class LazyLoadImageHooks extends IntersectionObserverHooks {
    constructor(private studentService: StudentService) {
        super();
    }
    loadImage({ imagePath }: Attributes): Observable<string> {
        return this.studentService.GetStudentPhoto(imagePath).pipe(
            map(blob => blob.url)
        );
    }
}