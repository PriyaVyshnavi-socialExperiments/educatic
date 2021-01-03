import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { StudentLoginRequest } from 'src/app/_models/login-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-signin',
  templateUrl: './student-signin.page.html',
  styleUrls: ['./student-signin.page.scss'],
})
export class StudentSigninPage implements OnInit {
  studentLoginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private authenticationService: AuthenticationService,
    private router: Router,
    public toastController: ToastController,

  ) { }

  ngOnInit() {
    this.studentLoginForm = this.formBuilder.group({
      studentEnrolmentNumber: new FormControl('', [
        Validators.required,
      ])
    });
  }

  dismissModal() {
    this.modalController.dismiss().then(() => { this.modalController = null; });
  }

  get f() {
    return this.studentLoginForm.controls;
  }

  onSubmit() {
    this.dismissModal();
    if (this.studentLoginForm.invalid) {
      return;
    } else {
      const loginRequest = {
        enrolmentNo: this.f.studentEnrolmentNumber.value
      } as StudentLoginRequest;
      this.authenticationService.StudentLogin(loginRequest)
        .subscribe((user) => {
          this.authenticationService.RefreshNotificationToken();
          this.router.navigate(['assignment/subjects']);
        },
          error => {
            this.presentToast();
          });
    }
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'The enrolment number incorrect, or no account exists for this enrolment number.',
      position: 'top',
      duration: 10000,
      color: 'danger',
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }

}
