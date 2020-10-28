import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CourseCategoryPage } from '../../../course-category/course-category.page';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';
import { IAssignment, ISubjectAssignmentList } from 'src/app/_models/assignment';
import { AuthenticationService } from 'src/app/_services';
import { ISchool, IUser } from 'src/app/_models';

@Component({
  selector: 'app-assignment-subjects',
  templateUrl: './assignment-subjects.page.html',
  styleUrls: ['./assignment-subjects.page.scss'],
})
export class AssignmentSubjectsPage implements OnInit {

  subjectList: ISubjectAssignmentList[] = [];
  currentUser: IUser;
  school: ISchool;
  classId: string;

  constructor(
    public router: Router,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.refreshSubjects();
  }

  ionViewWillEnter() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.school = user.defaultSchool;
      this.classId = this.activatedRoute.snapshot.paramMap.get('classId');
      this.assignmentService.GetAssignments(this.school.id, this.classId).subscribe((assignments) => {
        this.assignmentService.GetSubjectWiseAssignments(assignments).subscribe((asmts) => {
          this.subjectList = [...asmts];
        });
      })
    });
  }

  public selectSubject(subjectName: string) {
    this.router.navigateByUrl(`teacher/assignment/${this.classId}/list/${subjectName}`);
  }

  public async AddSubject() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: CourseCategoryPage,
        componentProps: { title: 'Subject' }
      });

    modal.onDidDismiss()
      .then((modalData: any) => {
        console.log(modalData.data);
        const newSubjects = modalData.data.categoryList.map(
          (subjects) => { return { key: subjects.name, length: 0, assignment: [] } as ISubjectAssignmentList }
        );
        if (newSubjects.length > 0) {
          this.subjectList = [...this.subjectList, ...newSubjects];
          this.subjectList = [...new Map(this.subjectList.map(item => [item.key, item])).values()]
          //this.assignmentService.AddOfflineSubjects(this.subjectList);
        }
      });
    await modal.present();
  }

  private refreshSubjects() {
    this.assignmentService.GetOfflineSubjects().then((subjects) => {
      if (subjects) {
        //this.subjectList = [...subjects];
      }
    });
  }

}
