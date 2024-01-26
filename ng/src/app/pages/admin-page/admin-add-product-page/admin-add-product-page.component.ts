import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { IconsService } from "../../../shared/services/icons.service";

@Component({
  selector: "app-admin-add-product-page",
  templateUrl: "./admin-add-product-page.component.html",
  styleUrl: "./admin-add-product-page.component.css",
})
export class AdminAddProductPageComponent implements OnInit {
  productForm: FormGroup;
  mainImgFile;
  mainImgURL;
  images: Array<{ file; url }> = [];

  constructor(protected iconsService: IconsService) {}

  ngOnInit() {
    this.productForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      stock: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  submitHandler() {
    console.log(this.productForm);
    console.log(this.productForm.value);
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

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        this.images.push({ file: element, url });
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
}
