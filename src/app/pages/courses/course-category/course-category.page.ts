import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';

@Component({
  selector: 'app-course-category',
  templateUrl: './course-category.page.html',
  styleUrls: ['./course-category.page.scss'],
})
export class CourseCategoryPage implements OnInit {
  @Input() title: any;
  categoryList: ICourseContentCategory[] = [];
  categoryForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      courseCategory: new FormControl('', [
        Validators.required
      ])
    });

    this.title = this.title? this.title : 'Course category(subject)';
  }

  get f() {
    return this.categoryForm.controls;
  }

  addCategory() {
    const courseCategory: string = this.f.courseCategory.value;
    if (courseCategory) {
      const category = { id: this.categoryList.length.toString(), name: courseCategory, } as ICourseContentCategory;

      if (!this.categoryList.some((item) => item.name.trim().toLowerCase() === courseCategory.trim().toLowerCase())) {
        this.categoryList.unshift(category);
      }
      this.categoryForm.reset();
    }
  }

  dismissModal() {
    this.modalController.dismiss({
      categoryList: this.categoryList,
      selectedCategory: this.categoryList[0]
    }).then(() => { this.modalController = null; });
  }

  AddCategoryAndClose() {
    this.addCategory();
    this.dismissModal();
  }
  
  selectCategory(category: ICourseContentCategory) {
    this.modalController.dismiss({
      categoryList: this.categoryList,
      selectedCategory: category
    }).then(() => { this.modalController = null; });
  }

}
