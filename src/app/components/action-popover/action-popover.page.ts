import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-popover',
  templateUrl: './action-popover.page.html',
  styleUrls: ['./action-popover.page.scss'],
})
export class ActionPopoverPage implements OnInit {
  /** The current item the options are being shown for */
  public currentId: any;
  public type: string;

  /** Available options on popup */
  public showMoreOptions: Array<{
    icon: string;
    id: string;
    name: string;
  }>;


  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  public ionViewWillEnter() {
    this.currentId = this.navParams.get('id');
    this.type = this.navParams.get('type');

    /** Defines the available options */
    this.PopulateActionMenu(this.type);
  }

  /** Dismiss the popover with the selected option */
  public selectOption(option, currentId) {
    this.popoverController.dismiss({
      selectedOption: option,
      currentId,
    });
  }

  private PopulateActionMenu(type: string) {
    switch (type) {
      case 'school':
        this.showMoreOptions = [
          {
            icon: 'create',
            id: 'edit',
            name: 'Update',
          },
          {
            icon: 'trash',
            id: 'delete',
            name: 'Delete',
          },
          {
            icon: 'information-circle',
            id: 'details',
            name: 'Details',
          },
          {
            icon: 'list',
            id: 'teachers',
            name: 'Teachers',
          },
          {
            icon: 'add-circle',
            id: 'add-teacher',
            name: 'Add Teacher',
          },
          {
            icon: 'list',
            id: 'class-rooms',
            name: 'Class Rooms',
          },
          {
            icon: 'add-circle',
            id: 'add-class-room',
            name: 'Add Class',
          },
        ];
        break;

      case 'teacher':
        this.showMoreOptions = [
          {
            icon: 'create',
            id: 'edit',
            name: 'Update',
          },
          {
            icon: 'trash',
            id: 'delete',
            name: 'Delete',
          },
          {
            icon: 'information-circle',
            id: 'details',
            name: 'Details',
          },
        ];
        break;

      default:
        break;
    }
  }

}
