import { Component, Input } from "@angular/core";
import { IconsService } from "../../services/icons.service";
import { Product } from "../../models/Product.model";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.css",
})
export class ProductCardComponent {
  @Input() product: Product;

  constructor(protected iconsService: IconsService, private cartService: CartService) {}

  addToCartHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("cart", event);
    this.cartService.toCart(this.product, 1).subscribe();
  }

  addToFavoriteHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.product.fav = !this.product.fav;
  }
}
