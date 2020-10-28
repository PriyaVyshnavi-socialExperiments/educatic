import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ICourseContent } from 'src/app/_models/course-content';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.page.html',
  styleUrls: ['./pdf-viewer.page.scss'],
})
export class PdfViewerPage implements OnInit {

  pdfContentURL = '';
  contentType = '';
  courseContent: ICourseContent;
  title = '';
  constructor(private contentService: CourseContentService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.courseContent = history.state;
    if (!this.courseContent.categoryName) {
      this.navCtrl.back();
    }
    this.title = `${this.courseContent.categoryName} - ${this.courseContent.courseName}`;
    if (!this.courseContent.isTokenRequired) {
      this.contentService.GetAzureContentURL(this.courseContent.courseURL).subscribe((url) => {
        this.pdfContentURL =url;
      })
    } else {
      this.pdfContentURL =this.courseContent.courseURL;
    }
  }

}
