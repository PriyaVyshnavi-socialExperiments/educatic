import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { ICourseContent } from 'src/app/_models/course-content';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit, AfterViewInit {
  @ViewChild('iframe') iframe: ElementRef;
  courseContent: ICourseContent;
  title = '';
  assessmentURL: any;

  constructor(
    private sanitizer: DomSanitizer,
    private navCtrl: NavController) {

  }

  ngOnInit() {
    this.courseContent = history.state;
    if (!this.courseContent?.courseAssessment) {
      this.navCtrl.back();
    }
    
    this.assessmentURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.courseContent.courseAssessment);
    this.title = `${this.courseContent.courseCategory} - ${this.courseContent.courseName}`;
  }

  ngAfterViewInit() {
    //   const nativeEl =  this.iframe.nativeElement;
    //   if ( (nativeEl.contentDocument || nativeEl.contentWindow.document).readyState === 'complete' )        {
    //     nativeEl.onload = this.onIframeLoad.bind(this);
    // } else {
    //   if (nativeEl.addEventListener) {
    //     nativeEl.addEventListener('load', this.onIframeLoad.bind(this), true);
    //   } else if (nativeEl.attachEvent) {
    //     nativeEl.attachEvent('onload', this.onIframeLoad.bind(this));
    //   }
    // }
  }

  onIframeLoad() {
    //const base64String = this.iframe.nativeElement.contentWindow.document.body.innerHTML;
    //console.log(this.iframe.nativeElement.contentWindow.document);

    //iframe.contentWindow.document.getElementsByTagName("H1")[0];
  }

  loadiFrame(event) {
    console.log("loadiFrame: ", event.path);
  }

}
