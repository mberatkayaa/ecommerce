import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { IconsService } from "../../../shared/services/icons.service";
import { HttpClient } from "@angular/common/http";
import { domain } from "../../../shared/misc/constants";
import { CategoryService } from "../../../shared/services/category.service";
import { Subscription } from "rxjs";
import { Category } from "../../../shared/models/Category.model";

@Component({
  selector: "app-admin-add-product-page",
  templateUrl: "./admin-add-product-page.component.html",
  styleUrl: "./admin-add-product-page.component.css",
})
export class AdminAddProductPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  categories: Array<{ category: Category; checked: boolean }> = [];

  productForm: FormGroup;
  mainImgFile;
  mainImgURL;
  images: Array<{ file; url }> = [];

  constructor(
    protected iconsService: IconsService,
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.subscription = this.categoryService.categories.subscribe({
      next: (value) => {
        if (!value) {
          this.categories = [];
          return;
        }
        value.forEach((x) => {
          const index = this.categories.findIndex((y) => y.category._id === x._id);
          if (index > 0) {
            this.categories[index].category = { ...x };
          } else {
            this.categories.push({ category: x, checked: false });
          }
        });
        this.categories = this.categories.filter((x) => {
          return value.findIndex((y) => y._id === x.category._id) >= 0;
        });
      },
    });

    this.productForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      unit: new FormControl(null),
      stock: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnDestroy(): void {
    this.clearSubscription();
  }

  submitHandler() {
    const formData = new FormData();
    formData.append("file-mainImg", this.mainImgFile);
    this.images.forEach((x) => {
      formData.append("file-images", x.file);
    });
    const obj = {
      ...this.productForm.value,
      categories: JSON.stringify(this.categories.filter((x) => x.checked).map((x) => x.category._id)),
    };
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        formData.append(key, element);
      }
    }
    this.http.post<any>("http://localhost:3000/admin/products/add", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    return;
    console.log(this.productForm);
    console.log(this.productForm.value);

    this.http.post(domain + "admin/products/add", obj).subscribe({
      next: (result) => {
        console.log("Add product done: ", result);
      },
      error: (err) => {
        console.log("Add product failed: ", err);
      },
    });
  }

  mainImgSelectedHandler(file: FileList) {
    this.mainImgFile = file.length > 0 ? file.item(0) : null;
    if (!this.mainImgFile) {
      this.mainImgURL = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      this.mainImgURL = event.target.result;
    };
    reader.readAsDataURL(this.mainImgFile);
  }

  imagesSelectedHandler(target) {
    const file: FileList = target.files;
    for (let i = 0; i < file.length; i++) {
      const element = file.item(i);
      const reset = i === file.length - 1;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        this.images.push({ file: element, url });
        if (reset) target.value = null;
      };
      reader.readAsDataURL(element);
    }
  }

  removeImgHandler(img: string | number) {
    if (img === "mainImg") {
      this.mainImgFile = null;
      this.mainImgURL = null;
    } else if (this.images.length > +img) {
      this.images.splice(+img, 1);
    }
  }

  checkedChangedHandler(catId: string, value: boolean) {
    const obj = this.categories.find((x) => x.category._id === catId);
    if (obj) obj.checked = value;
  }

  clearSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
