import { Component, ElementRef, ViewChild } from "@angular/core";
import { Product } from "../../models/Product.model";
import { ProductService } from "../../services/product.service";
import { HttpParams } from "@angular/common/http";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-product-search-bar",
  templateUrl: "./product-search-bar.component.html",
  styleUrl: "./product-search-bar.component.css",
})
export class ProductSearchBarComponent {
  private timeoutId;
  private subscription: Subscription;

  @ViewChild("searchInput", { static: true }) inputEl: ElementRef<HTMLInputElement>;

  products: Array<Product> = [];
  loading: boolean = false;
  selectedIndex: number = -1;
  expand: boolean = false;
  inputValue: string = "";
  iChangeValue: boolean = false;
  constructor(private productService: ProductService, private router: Router) {}

  inputChangedHandler(value) {
    this.clear();
    console.log(value);
    if (this.iChangeValue) return;
    this.inputValue = value;
    this.timeoutId = setTimeout(() => {
      this.subscription = this.productService
        .getProducts(new HttpParams().set("limit", 10).set("inStock", true).set("search", value))
        .subscribe({
          next: (value) => {
            this.loading = value.status.loading;
            if (value.status.done) {
              this.products = value.result.body.docs;
              this.expand = this.products.length > 0;
            }
          },
        });
    }, 750);
  }

  selectedHandler(index) {
    if (index >= this.products.length || index < -1) return;
    this.selectedIndex = index;
    if (this.selectedIndex > -1) {
      this.iChangeValue = true;
      this.inputEl.nativeElement.value = this.products[this.selectedIndex].title;
      this.iChangeValue = false;
    } else {
      this.inputEl.nativeElement.value = this.inputValue;
    }
  }

  activatedHandler(value: number) {
    if (value < -1 || value >= this.products.length) return;
    if (value === -1) {
      this.router.navigate(["/shop"], { queryParams: { search: this.inputValue }, queryParamsHandling: "" });
    } else {
      this.router.navigate([`/prod/${this.products[value].slug}`]);
    }
  }

  keydownHandler(event: KeyboardEvent) {
    if (this.expand) {
      if (event.key === "ArrowDown") {
        this.selectedHandler(this.selectedIndex + 1);
        event.preventDefault();
      }
      if (event.key === "ArrowUp") {
        this.selectedHandler(this.selectedIndex - 1);
        event.preventDefault();
      }
      if (event.key === "Enter") {
        this.activatedHandler(this.selectedIndex);
      }
    }
  }

  blurHandler() {
    this.expand = false;
    console.log("BLUR");
    this.inputEl.nativeElement.value = this.inputValue;
  }

  focusHandler() {
    this.expand = !this.loading && this.products.length > 0;
  }

  private clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
