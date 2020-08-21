import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool, IUser } from '../../_models';
import { PopoverController, AlertController, MenuController } from '@ionic/angular';
import { ActionPopoverPage } from '../../components/action-popover/action-popover.page';
import { Router } from '@angular/router';
import { DataShareService } from '../../_services/data-share.service';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.page.html',
  styleUrls: ['./schools.page.scss'],
})
export class SchoolsPage implements OnInit {
  schools: ISchool[] = [];
  currentUser: IUser;

  constructor(
    private schoolService: SchoolService,
    private popoverController: PopoverController,
    public router: Router,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private dataShare: DataShareService,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if( !user) {
        return;
      }
      this.currentUser = user;
    });
    this.schoolService.GetSchools().subscribe((data) => {
      this.schools = [...data]
    });
  }

  edit() {

  }

  public async actionPopover(ev: any, schoolId: string) {

    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { id: schoolId, type: 'school' },
      cssClass: 'pop-over-style',
    });
    //popover.style.cssText = '--min-width: 170px; --max-width: 200px;';
    popover.onDidDismiss().then((data) => {
      if(!data.data) {
        return;
      }
      const actionData = data?.data;
      this.currentUser.schoolId = actionData.currentId;
      switch (actionData?.selectedOption) {
        case 'edit':
          this.SchoolEdit(actionData.currentId);
          break;
        case 'delete':
          this.SchoolDelete(actionData.currentId);
          break;
        case 'details':
          this.SchoolDetails(actionData.currentId);
          break;
        case 'teachers':
          this.router.navigateByUrl(`/teachers/${actionData.currentId}`);
          break;
        case 'add-teacher':
          this.router.navigateByUrl(`/teacher/add/${actionData.currentId}`);
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  public SchoolEdit(schoolId: string) {
    const currentSchool = this.schools.find(school => school.id === schoolId);
    this.dataShare.setData(currentSchool);
    this.router.navigateByUrl(`/school/edit/${schoolId}`);
  }

  public async SchoolDelete(schoolId: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete',
      message: 'Are you sure you want delete this school?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.schools = this.schools.filter((school) => {
              return school.id !== schoolId;
            });
          }
        }
      ]
    });
    await alert.present();
  }

  public SchoolDetails(schoolId: string) {
    const currentSchool = this.schools.find(school => school.id === schoolId);
    this.schoolService.setSchoolDetails(currentSchool)
    this.menuCtrl.open('end');
  }

  public  ClassList(ev: any, schoolId: string) {
    this.currentUser.schoolId = schoolId;
    this.router.navigateByUrl(`/class-rooms/${schoolId}`);
  }

  public  NewClass(ev: any, schoolId: string) {
    this.currentUser.schoolId = schoolId;
    this.router.navigateByUrl(`/class-room/add/${schoolId}`);
  }

}