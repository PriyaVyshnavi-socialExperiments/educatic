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
  this.currentId = this.navParams.get( 'id' );

  /** Defines the available options */
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
}

/** Dismiss the popover with the selected option */
public selectOption( option, currentId ) {
  this.popoverController.dismiss( {
      selectedOption: option,
      currentId,
  } );
}


}
