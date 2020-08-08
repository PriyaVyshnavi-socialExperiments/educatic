import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserProfileService } from '../../_services';
import { IUser, IUserProfile } from '../../_models';
import { ConfirmedValidator } from '../../_helpers/confirmed.validator';
import { getInitials } from '../../_helpers'
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  profileForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  currentUser: IUser;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalCtrl: ModalController,
    private userProfilePage: UserProfileService,
    public toastController: ToastController

  ) { }
  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

    this.profileForm = this.formBuilder.group({
      firstname: new FormControl(this.currentUser.firstName, [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      lastname: new FormControl(this.currentUser.lastName, [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      email: new FormControl(
        this.currentUser.email,
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
          Validators.maxLength(200),
        ]),
      password: new FormControl('',
        [
          Validators.pattern(/(?=.*[\d|\W])(?=.*[a-zA-Z]).{7,}/),
          Validators.maxLength(25),
        ]),
      cpassword: new FormControl('', [
        Validators.pattern(/(?=.*[\d|\W])(?=.*[a-zA-Z]).{7,}/),
        Validators.maxLength(25),
      ])
    },
      {
        validator: ConfirmedValidator('password', 'cpassword')
      });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.profileForm.controls;
  }
  public UpdateProfile() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    } else {
      const userProfile = {
        id: this.currentUser.id,
        firstName: this.f.firstname.value,
        lastName: this.f.lastname.value,
        email: this.f.email.value,
        password: this.f.password.value,
        confirmPassword: this.f.cpassword.value
      } as IUserProfile;

      this.currentUser.firstName = userProfile.firstName;
      this.currentUser.lastName = userProfile.lastName;
      this.currentUser.email = userProfile.email;
      this.userProfilePage.UpdateUserProfile(userProfile, this.currentUser).subscribe((res) => {
        this.presentToast();
      });
    }
  }

  public GetInitials() {
    return getInitials(`${this.currentUser.firstName}  ${this.currentUser.lastName}`)
  }

  public selectAvatar(event) {
    const file = event.target.files[0];

    if (!file.type || !file.type.match('image.*')) {
      return;
    }

    /**
     * We add the special class which can be used by the crop modal to adjust modal size.
     */
    // const modal = this.modalCtrl.create( 'CropModal', { image: event }, { cssClass: 'image-crop-modal' } );
    // modal.present();

    // modal.onDidDismiss( ( data ) => {
    //     this.fileInput.nativeElement.value = '';

    //     if ( !data ) {
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append( 'avatarImage', data );
    //     formData.append( 'uid', this.user.current.id );

    //     this.api.uploadAvatar( formData ).pipe( take( 1 ) ).subscribe( () => {
    //         this.user.update( true );
    //     } );
    //} );

  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile changed successfully..',
      position: 'bottom',
      duration: 5000,
      color: 'success',
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
