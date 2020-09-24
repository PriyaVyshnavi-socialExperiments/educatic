import { Component, OnInit } from '@angular/core';
import { ICourseContent } from 'src/app/_models/course-content';
import { BlobStorageRequest } from 'src/app/_services/azure-blob/azure-storage';
import { SasGeneratorService } from 'src/app/_services/azure-blob/sas-generator.service';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.page.html',
  styleUrls: ['./content-viewer.page.scss'],
})
export class ContentViewerPage implements OnInit {
  supportedContents = ['pdf'];
  contentURL = '';
  contentType = '';
  courseContent: ICourseContent;
  title = '';
  constructor(private sasGeneratorService: SasGeneratorService) { }

  ngOnInit() {
    this.courseContent = history.state;
    this.title = `${this.courseContent.categoryName} - ${this.courseContent.courseName}`;
    this.contentType = this.courseContent.courseURL.replace(/^.*\./, '').toLowerCase();
    if (this.supportedContents.indexOf(this.contentType) > -1) {
      this.sasGeneratorService.getSasToken('coursecontent').subscribe((blobStorage: BlobStorageRequest) => {
        this.contentURL = `${blobStorage.storageUri}coursecontent/${this.courseContent.courseURL}`;
      })
    }
  }

}
