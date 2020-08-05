import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../_services';
import { LoginRequest } from '../../../_models';
import { first } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { ErrorStateMatcherHelper } from '../../../_helpers/error-state-matcher';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  loginRequest: LoginRequest;
  error = '';
  loading = false;
  matcher = new ErrorStateMatcherHelper();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastController: ToastController
  ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loginRequest = {
        email: this.f.username.value,
        password: this.f.password.value
      };
      this.authenticationService.Login(this.loginRequest)
        .subscribe( (data) => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.presentToast();
            this.loading = false;
          });
    }
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'The email address or password are incorrect, or no account exists for this email. Sign up for an account below.',
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
