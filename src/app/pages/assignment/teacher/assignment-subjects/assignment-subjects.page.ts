import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CourseCategoryPage } from '../../../course-category/course-category.page';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';
import { AssignmentService } from 'src/app/_services/assignment/assignment.service';

@Component({
  selector: 'app-assignment-subjects',
  templateUrl: './assignment-subjects.page.html',
  styleUrls: ['./assignment-subjects.page.scss'],
})
export class AssignmentSubjectsPage implements OnInit {

  subjectList: ICourseContentCategory[] = [];

  constructor(
    public router: Router,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.refreshSubjects();
  }

  public selectSubject(subjectName: string) {
    const classId = this.activatedRoute.snapshot.paramMap.get('classId');
    this.router.navigateByUrl(`teacher/assignment/${classId}/list/${subjectName}`);
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
        const newSubjects = modalData.data.categoryList;
        if (newSubjects.length > 0) {
          this.subjectList = [...this.subjectList, ...newSubjects];
          this.subjectList = [...new Map(this.subjectList.map(item => [item.name, item])).values()]
          this.assignmentService.AddOfflineSubjects(this.subjectList);
        }
      });
    await modal.present();
  }

  private refreshSubjects() {
    this.assignmentService.GetOfflineSubjects().then((subjects) => {
      if(subjects) {
        this.subjectList = [...subjects];
      }
    });
  }

}
