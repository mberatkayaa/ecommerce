import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Data } from "@angular/router";
import { Product } from "../../shared/models/Product.model";
import { CartService } from "../../shared/services/cart.service";

@Component({
  selector: "app-product-detail-page",
  templateUrl: "./product-detail-page.component.html",
  styleUrl: "./product-detail-page.component.css",
})
export class ProductDetailPageComponent implements OnInit {
  product: Product;
  quantity: number = 1;
  selected: number = 0;

  setQuantity(value) {
    this.quantity = Math.ceil(+value);
    if (this.quantity < 1) this.quantity = 1;
  }

  constructor(private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        this.product = data.product;
      },
    });
  }

  toCartHandler() {
    this.cartService.toCart(this.product, this.quantity).subscribe();
  }
}
