import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { IAssignment, IStudentAssignment } from 'src/app/_models/assignment';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { ISchool, IUser, Role } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { ICourseContent } from 'src/app/_models/course-content';
import { DataShareService } from 'src/app/_services/data-share.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.page.html',
  styleUrls: ['./assignment-list.page.scss'],
})
export class AssignmentListPage implements OnInit {
  assignments: IAssignment[] = [];

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  assignmentFor = 'teacher';
  classId: string;
  subjectName: string;
  currentUser: IUser;
  school: ISchool;

  constructor(
    private modalController: ModalController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private dataShare: DataShareService) {
  }

  ionViewWillEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
      this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subjectName');
      this.assignmentService.GetAssignments(this.school.id, this.classId).subscribe((list) => {
        this.assignmentService.GetSubjectWiseAssignments(list).subscribe((asms) => {
          const subjectWiseAssignments = asms.find((a) => a.key === this.subjectName);
          this.assignments = [...subjectWiseAssignments?.assignment || []];
          this.assignments.map(p =>
            p.studentAssignments?.length > 0
              ? { ...p, studentAssignmentList: p.studentAssignments }
              : p
          );
        });
      })
    });
    console.log('assignment list..')
  }

  ngOnInit() {

  }

  segmentChanged(event) {
    this.assignmentFor = event.detail.value;
  }

  async ViewTeacherAssignment(assignment: IAssignment) {
    const fileExt = assignment.assignmentURL.split('.').pop();
    const assignmentURL = `${environment.blobURL}/assignments/${assignment.assignmentURL}`;

    this.ViewAssignment(fileExt, assignmentURL, assignment.assignmentName, assignment.id);

  }

  async ViewStudentAssignment(studAssignment: IStudentAssignment, assignmentName: string, id) {
    const fileExt = studAssignment.assignmentURL.split('.').pop();
    const assignmentURL = `${environment.blobURL}/assignments/${studAssignment.assignmentURL}`;
    this.ViewAssignment(fileExt, assignmentURL, assignmentName,  studAssignment.id, studAssignment);

  }

  UploadAssignment(assignment: IAssignment = null) {
    if (assignment) {
      this.dataShare.setData(assignment);
      this.router.navigateByUrl(`assignment/${this.classId}/upload/${this.subjectName}`);
    } else {
      this.router.navigateByUrl(`assignment/${this.classId}/upload/${this.subjectName}`);
    }
  }

  ShowHideBadge(assignmentDate) {
    const tdate = new Date();
    tdate.setDate(tdate.getDate() + 1);
    const asmDate = this.datePipe.transform(assignmentDate, 'dd-MM-yyyy');
    const todayDate = this.datePipe.transform(tdate, 'dd-MM-yyyy');
    return todayDate < asmDate;
  }

  FilterStudentAssignments(studentAssignments: IStudentAssignment[]) {
    if (this.currentUser.role === Role.Student) {
      return studentAssignments.filter((a) => a.studentId === this.currentUser.id);
    }
    return studentAssignments;
  }

  private async ViewAssignment(fileExt, assignmentURL, assignmentName, id, studentAssignments?: IStudentAssignment) {
    const content = {
      courseURL: assignmentURL,
      courseCategory: this.subjectName,
      courseName: assignmentName,
      isTokenRequired: true,
      id,
    } as ICourseContent;

    if (fileExt.toLowerCase() === 'pdf') {
      this.router.navigateByUrl(`content/${content.id}/pdf-viewer`, { state: content });
    } else {
      if (this.currentUser.role !== Role.Student && studentAssignments) {
        this.router.navigateByUrl(`content/${studentAssignments.id}/image-viewer`,
        { state: {assignment: content, studAssignment: studentAssignments} });
      } else {
        const modal: HTMLIonModalElement = await this.modalController.create({
          component: ViewerModalComponent,
          componentProps: {
            src: assignmentURL + `?d=${Math.floor(Math.random() * 1000000000)}`,
            title: `${this.subjectName} - ${assignmentName}`
          },
          cssClass: 'ion-img-viewer',
          keyboardClose: true,
          showBackdrop: true,
        });

        return await modal.present();
      }
    }
  }

}
