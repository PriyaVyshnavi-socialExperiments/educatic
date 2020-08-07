import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-popover',
  templateUrl: './action-popover.page.html',
  styleUrls: ['./action-popover.page.scss'],
})
export class ActionPopoverPage implements OnInit {
 /** The current item the options are being shown for */
 public currentItem: any;

 /** Available options on popup */
 public showMoreOptions: Array<{
  icon: string;
  id: string;
  name: string;
}>;


constructor(
  private navParams: NavParams,
  private popoverController: PopoverController) { }

ngOnInit() {}

public ionViewWillEnter() {
  this.currentItem = this.navParams.get( 'data' );

  /** Defines the available options */
  this.showMoreOptions = [
      {
          icon: 'create-outline',
          id: 'edit',
          name: 'Update',
      },
      {
        icon: 'trash-outline',
        id: 'delete',
        name: 'Delete',
    },
    {
      icon: 'reader-outline',
      id: 'details',
      name: 'Details',
  },
  ];
}

/** Dismiss the popover with the selected option */
public selectOption( option ) {
  this.popoverController.dismiss( {
      selectedOption: option,
  } );
}


}
