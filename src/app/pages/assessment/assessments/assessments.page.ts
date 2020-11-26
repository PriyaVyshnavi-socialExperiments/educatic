import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, Role } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {
  title = 'Assessments';
  currentUser: IUser;
  isStudent: boolean;

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.isStudent = this.currentUser.role === Role.Student;
      if (this.isStudent) {
        this.title = 'My Assessments';
      }
    });
  }

  selectAssessment(subject: string) {
    this.router.navigate([`assessment/quizzes`]);
  }

}
