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
        this.categoryList.push(category);
      }
      this.categoryForm.reset();
    }
  }

  updateCategory(id: string) {

  }

  deleteCategory(id: string) {

  }

  dismissModal() {
    this.modalController.dismiss(this.categoryList).then(() => { this.modalController = null; });
  }

}
