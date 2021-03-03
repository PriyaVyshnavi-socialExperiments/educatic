import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Role } from 'src/app/_models';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';
import { ICategoryContentList, ICourseContent } from '../../../_models/course-content';
import { AuthenticationService } from '../../../_services/authentication/authentication.service';
import { CourseSharePage } from '../course-share/course-share.page';
import { ContentHelper } from 'src/app/_helpers/content-helper';
import { ActionPopoverPage } from 'src/app/components/action-popover/action-popover.page';
import { ContentOfflineService } from 'src/app/_services/content-offline/content-offline.service';
import * as blobUtil from 'blob-util';
import { HttpEventType } from '@angular/common/http';
import { removeSpecialSymbolSpace } from 'src/app/_helpers';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss']
})
export class CoursesPage implements OnInit {

  courseContent: ICourseContent[] = [];
  categoryWiseContent: ICategoryContentList[];
  levelWiseContent: ICategoryContentList[];
  categoryList: ICourseContentCategory[] = [];
  isStudent = false;
  title = '';
  contentKey: string = '';
  displaySource: string = 'cloud';

  constructor(
    private modalController: ModalController,
    private authService: AuthenticationService,
    private contentService: CourseContentService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private popoverController: PopoverController,
    public contentOfflineService: ContentOfflineService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.refreshContent();
  }

  public dismissModal() {
    this.courseContent = [];
    this.router.navigateByUrl(`/courses`);
  }

  public async ShareCourse(contentId) {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: CourseSharePage,
        mode: 'ios',
        componentProps: { contentId }
      });
    await modal.present();
  }

  ContentViewer(content: ICourseContent) {
    const contentType = content.courseURL.replace(/^.*\./, '').toLowerCase();
    if (ContentHelper.PdfSupported.indexOf(contentType) > -1) {
      this.router.navigateByUrl(`content/${content.id}/pdf-viewer`, { state: content });
    } else if (ContentHelper.AudioVideoSupported.indexOf(contentType) > -1) {
      this.router.navigateByUrl(`content/${content.id}/video-viewer`, { state: content });
    } else if (ContentHelper.ImgSupported.indexOf(contentType.toLowerCase()) > -1) {
      if (content.isOffline) {
        this.contentService.getOfflineContent(content.id).subscribe((data) => {
          const blob = blobUtil.base64StringToBlob(data, content.type);
          this.openViewer(window.URL.createObjectURL(blob), content);
        })

      } else {
        this.contentService.GetAzureContentURL(content.courseURL).subscribe((url) => {
          this.openViewer(url, content);
        })
      }
    }
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
              this.contentKey = this.activatedRoute.snapshot.paramMap.get('key');
              const content = contents.find((value) => value.key === this.contentKey);
              if (this.contentKey && this.displaySource === 'device') {
                const contentData = content.content.filter((item) => item.isOffline)
                this.courseContent = [...contentData];
              } else if (this.contentKey) {
                this.displaySource = 'cloud';
                this.courseContent = [...content.content];
              }
            });
          }, 1);
        }
      })
    });
  }

  public async actionPopover(ev: any, content) {
    console.log("content: ", content);
    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { type: 'course', isOffline: content.isOffline },
      cssClass: 'pop-over-style',
    });

    popover.onDidDismiss().then((data) => {
      if (!data.data) {
        return;
      }
      const actionData = data?.data;
      switch (actionData?.selectedOption) {
        case 'enableOffline':
          this.downloadContentToOffline(content);
          break;
        case 'disableOffline':
          this.disableOffline([content]);
          break;
        case 'share':
          this.ShareCourse(content.id);
          break;
        case 'remove':
          this.confirmCourseDelete(content);
          break;
        default:
          break;
      }
    });
    return await popover.present();
  }

  async openViewer(imgContentURL: string, content: ICourseContent) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      mode: 'ios',
      componentProps: {
        src: imgContentURL,
        title: `${content.courseCategory} - ${content.courseName}`
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true,
    });

    return await modal.present();
  }

  async confirmCourseDelete(course: ICourseContent) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm course delete!',
      message: `<strong>Are you sure you want to delete course?</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            course.active = false;
            this.contentService.deleteCourse(course).subscribe(async () => {
              this.presentToast('Course content delete successfully.', 'success');
              await this.contentService.UpdateCourseContentOfflineList(undefined, course.id).then(() => {
                this.refreshContent();
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }
  public downloadContentToOffline(content: ICourseContent) {
    content.saveProgress = 1;
    const onProgress = (event) => {
      content.saveProgress = Math.round((100 * event.loaded) / event.total);
      if (content.saveProgress === 100) {
        content.isOffline = true;
        content.saveProgress = 0;
      }
    };

    this.contentOfflineService.downloadContent(content, 'coursecontent', onProgress).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          const blob = event.body;
          blobUtil.blobToBase64String(blob).then(streamData => {
            return streamData;
          }).then((streamData) => {
            content.type = blob.type;
            this.contentService.UpdateCourseContentOfflineList(content, content.id, streamData).then(() => {
              //this.refreshContent();
            });
          })
        }
      });
  }

  public disableOffline(contents: ICourseContent[]) {
    contents.forEach(content => {
      content.isOffline = false;
      this.contentService.UpdateCourseContentOfflineList(content, content.id).then(() => {
        //this.refreshContent();
      });
    })
  }

  public bulkDownloadContentToOffline(contents: ICourseContent[]) {

    contents = contents.filter(c => {
      c.saveProgress = 1;
      return c;
    });

    contents.forEach(content => {
      const onProgress = (event) => {
        content.saveProgress = Math.round((100 * event.loaded) / event.total);
        if (content.saveProgress === 100) {
          content.isOffline = true;
          content.saveProgress = 0;
        }
      };

      this.contentOfflineService.downloadContent(content, 'coursecontent', onProgress).subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            const blob = event.body;
            blobUtil.blobToBase64String(blob).then(streamData => {
              return streamData;
            }).then((streamData) => {
              content.type = blob.type;
              this.contentService.UpdateCourseContentOfflineList(content, content.id, streamData).then(() => {
                //this.refreshContent();
              });
            })
          }
        });
    });
  }

  public contentDisplayChanged(ev: any) {
    if (ev.detail.value === 'cloud') {
      this.displaySource = 'cloud';
    } else {
      this.displaySource = 'device';
    }
    this.refreshContent();
  }

  public async enableDisableBulkOffline(contents: ICourseContent[]) {

    const anyOffline = contents.some((content) => {
      return content.isOffline === false;
    });
    const toStatus = anyOffline ? 'Enable' : 'Disable';

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `${toStatus} Offline Access`,
      message: `Are you sure you want to ${toStatus.toLowerCase()} offline access of all of your content?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            if (anyOffline) {
              this.bulkDownloadContentToOffline(contents);
            } else {
              this.disableOffline(contents);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: type,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
