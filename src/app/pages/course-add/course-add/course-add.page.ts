import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilePicker } from 'src/app/_services/azure-blob/file-picker.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.page.html',
  styleUrls: ['./course-add.page.scss'],
})
export class CourseAddPage implements OnInit {
  progress = 0;
  public courseForm: FormGroup;
  constructor(
    public filepicker: FilePicker,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      courseDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ])
    });
  }

  get f() {
    return this.courseForm.controls
  }


  SubmitCourse() {

  }

  setPercentBar(i) {
    setTimeout(() => {
      const apc = (i / 100)
      this.progress = apc;
    }, 100 * i);
  }

  uploadSuccess(item) {
    console.log("uploadSuccess: ", item);
  }

  uploadFail(item) {
    console.log("uploadFail: ", item);
  }

}