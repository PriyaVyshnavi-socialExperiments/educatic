import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { from, of, zip } from 'rxjs';
import { groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';
import { ICategoryContentList, ICategoryWiseContent, ICourseContent } from '../../_models/course-content';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { CourseSharePage } from '../course-share/course-share.page';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  courseContent: ICourseContent[] = [];
  categoryWiseContent: ICategoryContentList[];
  categoryList: ICourseContentCategory[] = [];
  group: number[] = [1, 2, 3, 4, 5];
  tmp: number[] = [1, 2, 3];
  courseContentDisplay = false;
  constructor(
    private modalController: ModalController,
    private authService: AuthenticationService,
    private contentService: CourseContentService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.authService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      if (user.CourseContent) {
        this.contentService.GetCategoryWiseContent(user.CourseContent).subscribe((groupResponse) => {
            this.categoryWiseContent = Object.values(groupResponse);
          });
      }
    });
  }


  public ViewContent(content: ICourseContent[]) {
    this.courseContent = [...content];
    this.courseContentDisplay = true;
  }

  public dismissModal() {
    this.courseContent = [];
    this.courseContentDisplay = false;
  }

  public async ShareCourse(event) {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: CourseSharePage,
        componentProps: {
        }
      });
    await modal.present();
  }

  courseAdd() {
    this.categoryList = this.categoryWiseContent.map((cat, index) =>  {
      return  {id: index.toString(), name: cat.key} as ICourseContentCategory;
    } )

    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.categoryList)
      }
    };
    this.router.navigateByUrl('/course/add', { state: this.categoryList });
  }

}
