import { Pipe, PipeTransform } from '@angular/core';
import { ICourseContent } from 'src/app/_models/course-content';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  constructor( private contentService: CourseContentService) {}
  transform(courseContent: ICourseContent[]): any {
    if(Array.isArray(courseContent)) {
      return this.contentService.GetLevelWiseContent(courseContent?.reverse());
    }
  }

}
