import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ICourseContent } from 'src/app/_models/course-content';
import { BlobStorageRequest } from 'src/app/_services/azure-blob/azure-storage';
import { SasGeneratorService } from 'src/app/_services/azure-blob/sas-generator.service';

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
  constructor(private sasGeneratorService: SasGeneratorService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.courseContent = history.state;
    if (!this.courseContent.categoryName) {
      this.navCtrl.back();
    }
    this.title = `${this.courseContent.categoryName} - ${this.courseContent.courseName}`;
    this.sasGeneratorService.getSasToken('coursecontent').subscribe((blobStorage: BlobStorageRequest) => {
      this.pdfContentURL = `${blobStorage.storageUri}coursecontent/${this.courseContent.courseURL}`;
    })
  }

}
