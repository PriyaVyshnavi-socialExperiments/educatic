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
  public schoolId: any;
  public type: string;
  public isOffline: boolean;

  /** Available options on popup */
  public showMoreOptions: Array<{
    icon: string;
    id: string;
    name: string;
    color?: string;
  }>;


  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  public ionViewWillEnter() {
    this.currentId = this.navParams.get('id');
    this.type = this.navParams.get('type');
    this.schoolId = this.navParams.get('schoolId');
    this.isOffline =this.navParams.get('isOffline');
    /** Defines the available options */
    this.PopulateActionMenu(this.type);
  }

  /** Dismiss the popover with the selected option */
  public selectOption(option, currentId) {
    this.popoverController.dismiss({
      selectedOption: option,
      currentId,
      schoolId: this.schoolId
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
          // {
          //   icon: 'information-circle',
          //   id: 'details',
          //   name: 'Details',
          // },
        ];
        break;

      case 'class-room':
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
        ];
        break;

      case 'student':
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
          }
        ];
        break;

        case 'course':
          this.showMoreOptions = [
            {
              icon: 'share-social-sharp',
              id: 'share',
              name: 'Share',
              color: 'secondary'
            },
            {
              icon: this.isOffline? 'cloud-done' :'cloud-download',
              id: this.isOffline? 'disableOffline' : 'enableOffline',
              name: this.isOffline? 'Disable Offline': 'Enable Offline',
              color: this.isOffline? 'success' :'primary',
            },
            {
              icon: 'trash',
              id: 'remove',
              name: 'Remove',
              color: 'danger'
            }
          ];
          break;
      default:
        break;
    }
  }

}
