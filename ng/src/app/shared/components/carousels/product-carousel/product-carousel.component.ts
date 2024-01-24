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
    const itemCount = this.itemCount < 1 ? 1 : this.itemCount;
    this._options = {
      loop: true,
      center: true,
      items: itemCount,
      margin: 0,
      autoplay: this.products.length > itemCount,
      dots: false,
      autoplayTimeout: 2500,
      smartSpeed: 450,
      nav: false,
      mouseDrag: this.products.length > itemCount,
      touchDrag: this.products.length > itemCount,
      autoplayHoverPause: true,
    };
  }
}
