import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ICourseContent } from 'src/app/_models/course-content';
import { CourseContentService } from 'src/app/_services/course-content/course-content.service';
import * as blobUtil from 'blob-util';

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
    if (!this.courseContent.courseCategory) {
      this.navCtrl.back();
    }
    this.title = `${this.courseContent.courseCategory} - ${this.courseContent.courseName}`;
    if(this.courseContent.isOffline) {
      const blob = blobUtil.base64StringToBlob(this.courseContent.offlineData, this.courseContent.type);
      this.pdfContentURL =  window.URL.createObjectURL(blob);
    } else if (!this.courseContent.isTokenRequired) {
      this.contentService.GetAzureContentURL(this.courseContent.courseURL).subscribe((url) => {
        this.pdfContentURL =url;
      })
    } else {
      this.pdfContentURL =this.courseContent.courseURL;
    }
  }

}
