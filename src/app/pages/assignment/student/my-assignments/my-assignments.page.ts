import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getInitials } from 'src/app/_helpers';

@Component({
  selector: 'app-my-assignments',
  templateUrl: './my-assignments.page.html',
  styleUrls: ['./my-assignments.page.scss'],
})
export class MyAssignmentsPage implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit() {
  }

  public GetInitials(subject: string) {
    return getInitials(`${subject}`)
  }

  public selectSubject() {
    this.router.navigateByUrl(`/student/assignments/english`);
  }

}
