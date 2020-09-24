import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { from, of } from 'rxjs';
import { catchError, finalize, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators';
import { ICourseContentDistribution } from '../../_models/course-content-distribution';
import { ICategoryContentList, ICourseContent } from '../../_models/course-content';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class CourseContentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private auth: AuthenticationService,
  ) {
    super(injector);
  }

  public SubmitCourseContent(courseContent: ICourseContent) {
    if (!courseContent.id) {
      courseContent.id = Guid.create().toString();
    }
    return this.http.Post<any>('/content/create', courseContent)
      .pipe(
        map(response => {
          return response;
        }),
        finalize(() => {
          this.UpdateCourseContentOfflineList(courseContent);
        })
      );
  }

  public GetCourseContents() {
    if (!this.network.IsOnline()) {
      return this.getOfflineCourseContents();
    } else {

      return this.http.Get<ICourseContent[]>(`/api/contents`)
        .pipe(
          tap(response => {
            if (response) {
              this.SetOfflineData('CourseContent', 'course-content', response);
              return response;
            } else {
              return null;
            }
          }),
          catchError(() => {
            return this.getOfflineCourseContents();
          })
        );
    }
  }

  public DistributeCourseContent(distribution: ICourseContentDistribution) {
    if (!distribution.id) {
      distribution.id = Guid.create().toString();
    }
    return this.http.Post<any>('/content/distribution', distribution)
      .pipe(
        map(response => {
          return response;
        }),
      );
  }

  public GetCategoryWiseContent(CourseContent: ICourseContent[]) {
    return  from(CourseContent) 
    .pipe(
      groupBy(person => person.categoryName),
      mergeMap(group => group
        .pipe(
          reduce((acc, cur) => {
            acc.content.push(cur);
            acc.length = acc.content.length;
            return acc;
          },
            { key: group.key, content: [], length: 0 } as ICategoryContentList
          )
        )
      ),
      toArray()
    )
  }

  private getOfflineCourseContents() {
    return from(this.GetOfflineData('CourseContent', 'course-content')).pipe(
      tap(response => {
        if (response && response.length > 0) {
          return response as ICourseContent[];
        } else {
          return of(false);
        }
      })
    );
  }

  private async UpdateCourseContentOfflineList(content: ICourseContent, contentId?: string) {
    const data = await this.GetOfflineData('CourseContent', 'course-content');
    const courseContents = data ? data as ICourseContent[] : [];
    const courseContent = courseContents.find((s) => s.id === content.id);
    const courseContentList = courseContents.filter((cc) => {
      return cc.id !== (courseContent ? courseContent.id : contentId);
    });
    if (content) {
      courseContentList.unshift(content);
    }
    this.auth.currentUser.subscribe(async (currentUser) => {
      currentUser.courseContent = courseContentList;
      await this.SetOfflineData('CourseContent', 'course-content', courseContentList);
    });
  }

}
