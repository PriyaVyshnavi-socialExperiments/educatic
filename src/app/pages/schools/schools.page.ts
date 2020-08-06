import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../_services/school/school.service';
import { ISchool } from '../../_models';
import { PopoverController } from '@ionic/angular';
import { ActionPopoverPage } from 'src/app/components/action-popover/action-popover.page';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.page.html',
  styleUrls: ['./schools.page.scss'],
})
export class SchoolsPage implements OnInit {
  schools: ISchool[] = [];
  constructor(
    private schoolService: SchoolService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.schoolService.GetSchools().subscribe((data) => {
      this.schools = [...data]
      console.log('schools:', data);
    });
  }

  edit() {

  }

  /**
   * name
   */
  public async actionPopover(ev: any) {

    const popover = await this.popoverController.create({
      component: ActionPopoverPage,
      mode: 'ios',
      event: ev,
      componentProps: { page: 'Login' },
      cssClass: 'pop-over-style',
    });
    popover.style.cssText = '--min-width: 100px; --max-width: 170px;';
    popover.onDidDismiss().then( (data) => {
      console.log('Data: ', data);
    });

    return await popover.present();
  }
}