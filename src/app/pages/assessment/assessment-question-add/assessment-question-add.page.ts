import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import * as blobUtil from 'blob-util';
import { ContentHelper } from 'src/app/_helpers/content-helper';
import { IUser } from 'src/app/_models';
import { IAssessment, IQuestion } from 'src/app/_models/assessment';
import { QuestionType } from 'src/app/_models/question-type';
import { AuthenticationService } from 'src/app/_services';
import { AssessmentService } from 'src/app/_services/assessment/assessment.service';
import { dateFormat } from 'src/app/_helpers';

@Component({
  selector: 'app-assessment-question-add',
  templateUrl: './assessment-question-add.page.html',
  styleUrls: ['./assessment-question-add.page.scss'],
})
export class AssessmentQuestionAddPage implements OnInit {
  @ViewChild('documentEditForm') documentEditForm: FormGroupDirective;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  question: IQuestion;
  subjectName: string;
  questionForm: FormGroup;
  answerIndex = false;
  currentUser: IUser;
  quizAssessment: IAssessment;
  optionAnswer = 0;
  backURL = '';
  assessmentId = '';
  isImageSelect = false;
  questionImagePath: string | ArrayBuffer = '';
  questionImageFile: File ;
  listRightItems:  {
    text: string,
    imagePath: string,
    id: number
}[];
  listLeftItems:  {
    text: string,
    imagePath: string,
    answerId: number
}[];
  isLeftOptionWithImage = false;
  isRightOptionWithImage = false;
  imageUploadFor: string;
  currentOptionIndex: number = -1;

  constructor(private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private toastController: ToastController) { 
      this.listRightItems = [];
      this.listLeftItems = [];
    }

    onRenderItems(event) {
      console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
       let draggedItem = this.listRightItems.splice(event.detail.from,1)[0];
       this.listRightItems.splice(event.detail.to,0,draggedItem)
      //this.listRightItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
      event.detail.complete();
    }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      question: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      questionType: new FormControl('', [
        Validators.required,
      ]),
      shortAnswer: new FormControl(``),
      leftColValue: new FormControl(``),
      rightColValue: new FormControl(``),
      answerOptions: new FormArray([])
    });

    this.authenticationService.currentUser?.subscribe((user) => {
      if (!user) {
        return;
      }
      this.currentUser = user;
      this.subjectName = this.activatedRoute.snapshot.paramMap.get('subject');
      this.assessmentId = this.activatedRoute.snapshot.paramMap.get('id');
      const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
      this.backURL = `/assessment/${this.subjectName}/${this.assessmentId}/questions`;
      if (questionId) {
        this.assessmentService.GetOfflineAssessments().subscribe((subjectWise) => {
          subjectWise.subscribe((subjectAssessments) => {
            const subjectWiseAssessments = subjectAssessments.find((a) => a.subjectName.toLowerCase() === this.subjectName);
            if (subjectWiseAssessments) {
              this.subjectName = subjectWiseAssessments.subjectName;
              this.quizAssessment = subjectWiseAssessments.assessments?.find((a) => a.id === this.assessmentId) || {};
              if (this.quizAssessment?.assessmentQuestions) {
                this.question = this.quizAssessment.assessmentQuestions.find((a) => a.id === questionId);
                if (this.question) {
                  this.f.shortAnswer.setValue(this.question.shortAnswer);
                  this.f.question.setValue(this.question.questionDescription);
                  this.f.questionType.setValue(this.question.questionType);
                  this.fillAnswersOptions(this.question.questionType);
                  this.questionImagePath = this.question.questionImagePath;
                }
              }
            }
          })
        });
      }
    });
  }

  get f() {
    return this.questionForm.controls
  }

  get t() { return this.f.answerOptions as FormArray; }

  SubmitQuestion() {
    if (this.questionForm.invalid) {
      return;
    } else {
      const selectedQuestionType = this.f.questionType.value;
      const question = {
        id: this.question? this.question.id : Guid.create().toString(),
        questionDescription: this.f.question.value,
        questionType: selectedQuestionType,
        active: true
      } as IQuestion;

      question.questionDescription = this.f.question.value;
      question.questionType = selectedQuestionType;

      if (selectedQuestionType === QuestionType.ShortAnswer) {
        question.shortAnswer = this.f.shortAnswer.value;
      } else {
        question.optionAnswer = this.optionAnswer;
        const option = {};
        option[1] = this.t.value[0].option;
        option[2] = this.t.value[1].option;
        if (selectedQuestionType === QuestionType.Objective) {
          option[3] = this.t.value[2].option;
          option[4] = this.t.value[3].option;
        }
        question.questionOptions = option;
      }
      if(!question.optionAnswer) {
        this.presentToast('Please select/enter answer.', 'warning');
        return;
      }

      if (this.questionImageFile) {
        const fileExt = this.questionImageFile.type.split('/').pop();
        let blobDataURL = `${this.currentUser.defaultSchool.id}_${this.currentUser.defaultSchool.name}`;
        blobDataURL = `${blobDataURL}/${this.subjectName}`;
        blobDataURL = `${blobDataURL}/${question.id}_${dateFormat(new Date())}.${fileExt}`;
        question.questionImagePath = blobDataURL;
        this.questionImageFile.arrayBuffer().then((buffer) => {
          const blobData = blobUtil.arrayBufferToBlob(buffer);
          const fileData = ContentHelper.blobToFile(blobData, blobDataURL);
          this.assessmentService.CreateUpdateAssessmentQuestion(question, this.assessmentId, this.subjectName, fileData)
          .subscribe((res) => {
            if (res['message']) {
              this.presentToast('Assessment quiz question update successfully.', 'success');
            } else {
              console.log('Progress: ', res['progress']);
            }
          });
        });
      } else {
        this.assessmentService.CreateUpdateAssessmentQuestion(question, this.assessmentId, this.subjectName).subscribe((res) => {
          this.presentToast('Assessment quiz question update successfully.', 'success');
          this.router.navigateByUrl(this.backURL + `?d=${Math.floor(Math.random() * 1000000000)}`);
        });
      }
    }
  }

  selectedAnswerOption(event) {
    this.optionAnswer = event.target.value;
  }

  checkEvent($event) {
    console.log('$event: ', $event);
  }

  onChangeQuestionType(questionType) {
    this.fillAnswersOptions(questionType.value);
    this.isRightOptionWithImage = false;
    this.isLeftOptionWithImage = false;
  }

  imageSelectToggle() {
    this.isImageSelect = !this.isImageSelect;
    if(this.isImageSelect && !this.questionImagePath) {
      this.imageUploadFor = "Question";
      this.fileInput.nativeElement.click();
    }
  }

  editImage() {
    this.imageUploadFor = "Question";
    this.fileInput.nativeElement.click();
  }

  selectQuestionImage(event: EventTarget) {
    
    switch (this.imageUploadFor) {
      case 'Question':
        const callbackQuestion = result => {
          this.questionImagePath = result;
        }
        this.selectImage(event, callbackQuestion);
        break;
      case 'LeftOption':
        const callbackLeftOption = result => {
            this.listLeftItems[this.currentOptionIndex].imagePath = result;
        }
        this.selectImage(event, callbackLeftOption);
        break;
      case 'RightOption':
        const callbackRightOption = result => {
          this.listRightItems[this.currentOptionIndex].imagePath = result;
        }
        this.selectImage(event, callbackRightOption);
        break;
    
      default:
        break;
    }
  }

  selectImage(event: EventTarget, callback) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const imageFile = target.files[0];
    const fileExt = imageFile.type.split('/').pop();
    if ((ContentHelper.ImgSupported.indexOf(fileExt.toLowerCase()) > -1)) {

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = () => {
        callback(reader.result);
        this.currentOptionIndex = -1;
      };
    } else {
      this.presentToast(`This file type is not supported.`, 'danger');
    }
  }

  addLeftCol() {
    if(this.isLeftOptionWithImage) {
      this.imageUploadFor = "LeftOption";
      this.fileInput.nativeElement.click();
    }
    const leftColValue = this.f.leftColValue.value;
    const leftItems = this.listLeftItems.map(value => value.text.toLowerCase());

    if(leftColValue && leftItems.indexOf(leftColValue.toLowerCase()) === -1) {
      const option =  {
        text: leftColValue,
        imagePath: '',
        answerId: 0,
      }
      this.listLeftItems.push(option)
      this.currentOptionIndex = this.listLeftItems.length - 1;
      this.f.leftColValue.setValue("");
    }
  }

  addRightCol() {
    if(this.isRightOptionWithImage) {
      this.imageUploadFor = "RightOption";
      this.fileInput.nativeElement.click();
    }
    const rightColValue = this.f.rightColValue.value;
    const rightItems = this.listRightItems.map(value => value.text.toLowerCase());
    if (rightColValue  && rightItems.indexOf(rightColValue.toLowerCase()) === -1) {
      const option =  {
        text: rightColValue,
        imagePath: '',
        id: 0
    }
      this.listRightItems.push(option)
      this.currentOptionIndex = this.listRightItems.length - 1;
      this.f.rightColValue.setValue("");
    }
  }

  
  refreshOptionsId(options) {
    for (var i = 0, len = options.length; i < len; i++) {
      this.listLeftItems[options[i].id] = options[i];
    }
  }

  deleteLeftCol(index){
    this.listLeftItems.splice(index, 1);
  }

  deleteRightCol(index) {
    this.listRightItems.splice(index, 1);
  }

  private fillAnswersOptions(questionType) {
    this.t.clear();
    switch (questionType) {
      case QuestionType.Objective:
        for (let i = this.t.length; i < 4; i++) {
          const questionOption = this.question?.questionOptions[i + 1];
          this.t.push(this.formBuilder.group({
            option: [`${questionOption ? questionOption : ''}`]
          }));
        }
        break;
      case QuestionType.TrueFalse:
        this.t.push(this.formBuilder.group({
          option: [{ value: `True`, disabled: true }]
        }));
        this.t.push(this.formBuilder.group({
          option: [{ value: `False`, disabled: true }]
        }));
        break;
      case QuestionType.ShortAnswer:
        break;
      default:
        break;
    }
  }

  private async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: type,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }
      ]
    });
    toast.present();
  }
}
