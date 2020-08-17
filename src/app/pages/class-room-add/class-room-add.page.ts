import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassRoomService } from '../../_services/class-room/class-room.service';
import { DataShareService } from '../../_services/data-share.service';
import { IClassRoom, IUser } from '../../_models';
import { SchoolService } from '../../_services/school/school.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-class-room-add',
  templateUrl: './class-room-add.page.html',
  styleUrls: ['./class-room-add.page.scss'],
})
export class ClassRoomAddPage implements OnInit {

  public classRoomForm: FormGroup;
  public classRoom: IClassRoom;
  schoolInfo: any[] = [];
  isEditClassRoom = false;
  currentUser: IUser;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private classService: ClassRoomService,
    private dataShare: DataShareService,
    private schoolService: SchoolService,
    private toastController: ToastController,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.isEditClassRoom = params.has('id');
    });
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

    this.classRoomForm = this.formBuilder.group({
      classDivision: new FormControl('', [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      classRoomName: new FormControl('', [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(50),
      ]),
      school: new FormControl('', [
        Validators.required,
      ])
    });

    if (this.isEditClassRoom) {
      this.dataShare.getData().subscribe((data) => {
        this.classRoom = data;
        if (this.classRoom) {
          this.classRoomForm.setValue({
            classDivision: this.classRoom.classDivision,
            classRoomName: this.classRoom.classRoomName,
            schoolId: this.classRoom.schoolId,
          });
        }
      });
    }
    this.getSchools();
  }

  get f() {
    return this.classRoomForm.controls
  }

  public SubmitClassRoom() {
    if (this.classRoomForm.invalid) {
      return;
    } else {
      const classRoomInfo = {
        classId: this.classRoom?.classId,
        schoolId: this.f.school.value,
        classDivision: this.f.classDivision.value,
        classRoomName: this.f.classRoomName.value,
        createdBy: this.currentUser.id,
        updatedBy: this.currentUser.id
      } as IClassRoom;
      this.classService.SubmitClassRoom(classRoomInfo).subscribe(() => {
        this.presentToast();
        this.classRoomForm.reset(this.classRoomForm.value);
      });
    }
  }

  getSchools() {
    this.schoolService.GetSchools().toPromise().then((schools) => {
      this.schoolInfo = schools;
    });
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Class room updated successfully..',
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
