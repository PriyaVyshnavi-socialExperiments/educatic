import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICourseContentCategory } from 'src/app/_models/course-content-category';

@Component({
  selector: 'app-course-category',
  templateUrl: './course-category.page.html',
  styleUrls: ['./course-category.page.scss'],
})
export class CourseCategoryPage implements OnInit {
  categoryList: ICourseContentCategory[] = [];
  categoryForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      categoryName: new FormControl('', [
        Validators.required
      ])
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  addCategory() {
    const categoryName: string = this.f.categoryName.value;
    if (categoryName) {
      const category = { id: this.categoryList.length.toString(), name: categoryName, } as ICourseContentCategory;

      if (!this.categoryList.some((item) => item.name.trim().toLowerCase() === categoryName.trim().toLowerCase())) {
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

  selectCategory(category: ICourseContentCategory) {
    this.modalController.dismiss({
      categoryList: this.categoryList,
      selectedCategory: category
    }).then(() => { this.modalController = null; });
  }

}
