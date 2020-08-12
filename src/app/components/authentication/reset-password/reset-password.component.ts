import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../_services';
import { IUser } from '../../../_models';
import { ConfirmedValidator } from '../../../_helpers/confirmed.validator';
import { IResetPassword } from 'src/app/_models/reset-password';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  currentUser: IUser;
  resetPassword: IResetPassword

  constructor(
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    private router: Router,
    private authenticationService: AuthenticationService,

  ) { }

  public ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl('',
        [
          Validators.required,
          Validators.pattern(/(?=.*[\d|\W])(?=.*[a-zA-Z]).{7,}/),
          Validators.maxLength(25),
        ]),
      cpassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/(?=.*[\d|\W])(?=.*[a-zA-Z]).{7,}/),
        Validators.maxLength(25),
      ])
    },
      {
        validator: ConfirmedValidator('password', 'cpassword')
      });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  public onSubmit() {

    if (this.resetPasswordForm.invalid) {
      return;
    } else {
      this.resetPassword = {
        userId: this.currentUser.id,
        password: this.f.password.value,
        confirmPassword: this.f.cpassword.value
      };
      this.authenticationService.ResetPassword(this.resetPassword)
        .subscribe((data) => {
          this.router.navigate(['/']);
          this.presentToast('Password changed successfully.', 'success');
        },
          error => {
            this.authenticationService.Logout();
            this.router.navigate(['/login']);
            this.presentToast('Unable to change password.', 'danger');
          });
    }
  }

  private async presentToast(message: string, type: string) {
    const toast = await this.toastController.create({
      message,
      position: 'bottom',
      duration: 5000,
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
