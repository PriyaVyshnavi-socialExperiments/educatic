import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { concat, forkJoin, from, of } from 'rxjs';
import { catchError, finalize, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators';
import { ICourseContentDistribution } from '../../_models/course-content-distribution';
import { ICategoryContentList, ICourseContent } from '../../_models/course-content';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpService } from '../http-client/http.client';
import { NetworkService } from '../network/network.service';
import { OfflineService } from '../offline/offline.service';
import { BlobStorageRequest } from '../../_services/azure-blob/azure-storage';
import { SasGeneratorService } from '../../_services/azure-blob/sas-generator.service';
import { BlobUploadsViewStateService } from '../azure-blob/blob-uploads-view-state.service';
import { BlobSharedViewStateService } from '../azure-blob/blob-shared-view-state.service';
import { OfflineSyncURL } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class CourseContentService extends OfflineService {

  constructor(
    private http: HttpService,
    public injector: Injector,
    private network: NetworkService,
    private auth: AuthenticationService,
    private sasGeneratorService: SasGeneratorService,
    private blobUpload: BlobUploadsViewStateService,
    private blobShared: BlobSharedViewStateService,
  ) {
    super(injector);
  }

  public SubmitCourseContent(courseContent: ICourseContent, file: File) {
    return forkJoin([this.UploadCourseFileContent(file), this.updateCourseAPI(courseContent)]);
  }

  public deleteCourse(courseContent: ICourseContent) {
    return this.updateCourseAPI(courseContent)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  private updateCourseAPI(courseContent) {
    return this.http.Post<any>(OfflineSyncURL.CourseContent, courseContent);  
  }

  private UploadCourseFileContent(courseFile: File) {
    this.blobShared.setContainer$ = 'coursecontent';
    this.blobShared.resetSasToken$ = true;
    return this.blobUpload.uploadFile(courseFile);
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
    return from(CourseContent)
      .pipe(
        groupBy(course => course.courseCategory.toLowerCase()),
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

  public GetLevelWiseContent(courseContent: ICourseContent[]) {
    return from(courseContent)
      .pipe(
        groupBy(course => course.courseLevel?.length ? course.courseLevel.toLowerCase() : null),
        mergeMap(group => group
          .pipe(
            reduce((acc, cur) => {
              acc.content.unshift(cur);
              acc.length = acc.content.length;
              return acc;
            },
              { key: group.key?.length === 0 ? null : group.key, content: [], length: 0, level: true } as ICategoryContentList
            )
          )
        ),
        toArray()
      )
  }

  public GetAzureContentURL(contentURL: string) {
    return this.sasGeneratorService.getSasToken('coursecontent').pipe(
      map((blobStorage) => `${blobStorage.storageUri}coursecontent/${contentURL}`)
    );
  }

  public getOfflineCourseContents() {
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

  public getOfflineContent(contentId: string) {
    return from(this.GetOfflineData('CourseContent', contentId)).pipe(
      map(response => {
        if (response && response.length > 0) {
          return response;
        } else {
          return of(false);
        }
      })
    );
  }

  public async  UpdateCourseContentOfflineList(content: ICourseContent, contentId?: string, streamData?: string) {

    const data = await this.GetOfflineData('CourseContent', 'course-content');
   
    const courseContents = data ? data as ICourseContent[] : [];
    const courseContentList = courseContents.filter((cc) => {
      return  cc.id !== (content ? content.id : contentId);
    });
    if (content) {
      courseContentList.unshift(content);
    }
    this.auth.currentUser.subscribe(async (currentUser) => {
      currentUser.courseContent = [...courseContentList] ;
      await this.SetOfflineData('CourseContent', 'course-content', courseContentList);

      if (content.isOffline && streamData) {
        await this.SetOfflineData('CourseContent', content.id, streamData);
      }
    });
  }

}
