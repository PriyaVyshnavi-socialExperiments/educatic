import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ICourseCategory } from 'src/app/_models/course-category';

@Component({
  selector: 'app-course-category',
  templateUrl: './course-category.page.html',
  styleUrls: ['./course-category.page.scss'],
})
export class CourseCategoryPage implements OnInit {
  categoryList: ICourseCategory[] = [];
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
      const category = { id: this.categoryList.length.toString(), name: categoryName, } as ICourseCategory;

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
