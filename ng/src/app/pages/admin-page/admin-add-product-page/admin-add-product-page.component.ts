import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { IconsService } from "../../../shared/services/icons.service";
import { HttpClient } from "@angular/common/http";
import { domain } from "../../../shared/misc/constants";
import { CategoryService } from "../../../shared/services/category.service";
import { Subscription } from "rxjs";
import { Category } from "../../../shared/models/Category.model";
import { ActivatedRoute, Data } from "@angular/router";
import { Product } from "../../../shared/models/Product.model";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationHandlerService } from "../../../shared/services/notification-handler.service";

@Component({
  selector: "app-admin-add-product-page",
  templateUrl: "./admin-add-product-page.component.html",
  styleUrl: "./admin-add-product-page.component.css",
})
export class AdminAddProductPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private edit: boolean = true;
  private product: Product;

  existingMainImg: string = null;
  existingImages: Array<string> = [];

  categories: Array<{ category: Category; checked: boolean }> = [];

  productForm: FormGroup;
  mainImgFile;
  mainImgURL;
  images: Array<{ file; url }> = [];

  constructor(
    protected iconsService: IconsService,
    private http: HttpClient,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private notificationHandler: NotificationHandlerService
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
        this.handleExistingProductCategories();
      },
    });

    this.productForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      unit: new FormControl(null),
      stock: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
    });

    this.route.data.subscribe({
      next: (data: Data) => {
        this.edit = data.edit;
        this.product = data.product;
        if (this.product) {
          this.productForm.setValue({
            title: this.product.title,
            description: this.product.description,
            unit: this.product.unit,
            stock: this.product.stock,
            price: this.product.price,
          });

          this.handleExistingProductCategories();

          if (this.product.mainImg) {
            this.existingMainImg = this.product.mainImg;
          }

          if (this.product.images) {
            this.existingImages = this.product.images;
          }
        }
      },
    });
  }
  handleExistingProductCategories() {
    if (this.product && this.product.categories && this.product.categories.length > 0) {
      this.product.categories.forEach((x) => {
        const index = this.categories.findIndex((y) => y.category._id === x._id);
        if (index >= 0) {
          this.categories[index] = { category: x, checked: true };
        }
      });
    }
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
    if (this.existingMainImg) {
      obj.mainImg = this.existingMainImg;
    }
    if (this.existingImages && this.existingImages.length > 0) {
      obj.images = JSON.stringify(this.existingImages);
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        formData.append(key, element);
      }
    }

    const obs = this.edit
      ? this.productService.editProduct(formData, this.product._id)
      : this.productService.addProduct(formData);
    obs.subscribe({
      next: (value) => {
        const { status, result, bag } = value;
        if (status.loading) {
          value.setBag(
            this.notificationHandler.addNotification({
              type: "notification",
              title: this.edit ? "Düzenleniyor" : "Oluşturuluyor",
              description: `Ürün ${this.edit ? "düzenleniyor." : "oluşturuluyor."}`,
            })
          );
        } else if (status.completed) {
          if (bag) {
            this.notificationHandler.resolveNotification(bag);
          }
          if (status.done) {
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Başarılı!",
              description: `Ürün başarıyla ${this.edit ? "düzenlendi!" : "oluşturuldu!"}`,
            });
          }
        }
      },
      error: (value) => {
        const { result, bag } = value;
        if (bag) {
          this.notificationHandler.resolveNotification(bag);
        }
        this.notificationHandler.addNotification({
          type: "error",
          title: "Hata!",
          description: result.message,
        });
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

  removeImgHandler(img: string | number, existing: boolean = false) {
    if (existing) {
      if (img === "mainImg") {
        this.existingMainImg = null;
      } else if (this.existingImages.length > +img) {
        this.existingImages.splice(+img, 1);
      }
    }
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
