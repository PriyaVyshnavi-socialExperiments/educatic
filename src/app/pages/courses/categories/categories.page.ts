import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/_models';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';
import { ICategoryContentList, ICourseContent } from '../../../_models/course-content';
import { AuthenticationService } from '../../../_services/authentication/authentication.service';
import { ContentOfflineService } from 'src/app/_services/content-offline/content-offline.service';
import { removeSpecialSymbolSpace } from 'src/app/_helpers';
 
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  courseContent: ICourseContent[] = [];
  categoryWiseContent: ICategoryContentList[];
  categoryList: ICourseContentCategory[] = [];
  isStudent = false;

  constructor(
    private authService: AuthenticationService,
    private contentService: CourseContentService,
    private router: Router,
    public contentOfflineService: ContentOfflineService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.refreshContent();
  }


  public ViewContent(content: ICourseContent[], key: string) {
    const param = removeSpecialSymbolSpace(key);
    this.router.navigateByUrl(`courses/${param}`);
  }

  public dismissModal() {
    this.courseContent = [];
    this.router.navigateByUrl(`/courses`);
  }

  courseAdd() {
    this.categoryList = this.categoryWiseContent.map((cat, index) => {
      return { id: index.toString(), name: cat.key } as ICourseContentCategory;
    })

    this.router.navigateByUrl('/course/add', { state: this.categoryList });
  }

  refreshContent() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      if (user.role === Role.Student) {
        this.isStudent = true;
      }
      this.contentService.getOfflineCourseContents().subscribe((courseContent) => {
        if (courseContent) {
          setTimeout(() => {
            this.contentService.GetCategoryWiseContent(courseContent).subscribe((groupResponse) => {
              let contents = Object.values(groupResponse.reverse());
              this.categoryWiseContent = [...contents];
            });
          }, 1);
        }
      })
    });
  }
}
