import { IntersectionObserverHooks, Attributes } from 'ng-lazyload-image';
import { StudentService } from '../_services/student/student.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class LazyLoadImageHooks extends IntersectionObserverHooks {
    constructor(private studentService: StudentService) {
        super();
    }
    loadImage({ imagePath }: Attributes){
        console.log("imagePath: ", imagePath);
        if ( typeof imagePath === 'object') {
            return [URL.createObjectURL(imagePath)];
        } else  if ( imagePath === 'default') {
            return ['assets/images/avatar.svg'];
        }
        return this.studentService.GetStudentPhoto(imagePath).pipe(
            map(blob => blob.url)
        );
    }
}