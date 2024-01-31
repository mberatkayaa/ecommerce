import { Component, Input } from "@angular/core";
import { Product } from "../../../models/Product.model";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-product-carousel",
  templateUrl: "./product-carousel.component.html",
  styleUrl: "./product-carousel.component.css",
})
export class ProductCarouselComponent {
  private _products: Array<Product>;
  private _itemCount: number;

  protected _options: OwlOptions;

  isDragging: boolean = false;

  @Input() set products(value: Array<Product>) {
    this._products = value;
    this.setOptions();
  }
  get products(): Array<Product> {
    return this._products;
  }

  @Input() set itemCount(value: number) {
    this._itemCount = value;
    this.setOptions();
  }
  get itemCount(): number {
    return this._itemCount;
  }

  private setOptions() {
    const itemCount = Math.max(1, Math.min(this.itemCount, this.products.length - 1));
    this._options = {
      loop: true,
      // center: itemCount % 2 === 1,
      // items: itemCount,
      margin: 0,
      autoplay: this.products.length > itemCount,
      dots: false,
      autoplayTimeout: 2500,
      smartSpeed: 450,
      nav: false,
      mouseDrag: this.products.length > itemCount,
      touchDrag: this.products.length > itemCount,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: Math.min(itemCount,1)
        },
        640: {
          items: Math.min(itemCount,2)
        },
        768: {
          items: Math.min(itemCount,3)
        },
        1024: {
          items: Math.min(itemCount,4)
        },
        1280: {
          items: Math.min(itemCount,5)
        },
        1536: {
          items: Math.min(itemCount,5)
        }
      },
    };
  }
  private timeoutId;
  draggingHandler(event) {
    const value = event.dragging;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (value) {
      this.isDragging = value;
      console.log("DRAGGING: ", this.isDragging);
    } else {
      this.timeoutId = setTimeout(() => {
        this.isDragging = false;
        console.log("DRAGGING: ", this.isDragging);
      }, 500);
    }
  }
}
