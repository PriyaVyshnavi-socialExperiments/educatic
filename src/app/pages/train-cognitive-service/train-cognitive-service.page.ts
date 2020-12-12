import { Component, OnInit } from '@angular/core';
import { IQueueMessage } from 'src/app/_models/queue-message';
import { StudentService } from 'src/app/_services/student/student.service';

@Component({
  selector: 'app-train-cognitive-service',
  templateUrl: './train-cognitive-service.page.html',
  styleUrls: ['./train-cognitive-service.page.scss'],
})
export class TrainCognitiveServicePage implements OnInit {
  studentData: string;
  studentBlobDataURLs: string[] = [];
  constructor( private studentService: StudentService,) { }

  ngOnInit() {
  }

  ProcessData() {
    const parsedData = JSON.parse(this.studentData);
    parsedData.forEach(data => {
      const studentBlob = data.Data.split('/');
      const schoolID = studentBlob[0].split('_').pop();
      const classID = studentBlob[1];
      const studentID = studentBlob[2].split('_').pop();

      const queueMessage = {
        schoolId: schoolID,
        classId: classID,
        studentId: studentID,
        teacherId: 'ca9d221a-a87d-4119-aa93-3a22678e7e7b',
        pictureURLs: [data.Data],
        pictureTimestamp: new Date()
      } as IQueueMessage
      this.studentService.QueueBlobMessage(queueMessage).subscribe((res) => {
        console.log(`${queueMessage}- ${res}`);
      });
    });
  }

}
