import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassRoomService } from '../../_services/class-room/class-room.service';
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
  currentUser: IUser;


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private classService: ClassRoomService,
    private toastController: ToastController,
    private authenticationService: AuthenticationService,
    public router: Router,

  ) { }

  ngOnInit() {

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
      schoolId: new FormControl('', [
        Validators.required,
      ])
    });

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.schoolInfo = user.schools;
      const classId = this.activatedRoute.snapshot.paramMap.get('classId');
      if (classId) {
        const schoolId = this.activatedRoute.snapshot.paramMap.get('schoolId');
        const school = user.schools.find((s) => s.id === schoolId);
        this.classRoom = school.classRooms.find((s) => s.classId === classId);

        this.classRoomForm.setValue({
          classDivision: this.classRoom.classDivision,
          classRoomName: this.classRoom.classRoomName,
          schoolId: this.classRoom.schoolId,
        });
      }
    });
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
        schoolId: this.f.schoolId.value,
        classDivision: this.f.classDivision.value,
        classRoomName: this.f.classRoomName.value,
        createdBy: this.currentUser.id,
        updatedBy: this.currentUser.id
      } as IClassRoom;
      this.classService.SubmitClassRoom(classRoomInfo).subscribe((res) => {
        if (res === '409') {
          this.presentToast('Class name is not available for selected school.','danger');
        } else {
          this.presentToast('Class room updated successfully.', 'success');
          this.router.navigateByUrl(`/class-rooms/${classRoomInfo.schoolId}`);
        }
      });
    }
  }

  private async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
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
