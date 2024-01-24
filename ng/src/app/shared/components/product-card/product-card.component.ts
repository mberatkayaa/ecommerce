import { Component, Input } from "@angular/core";
import { IconsService } from "../../services/icons.service";
import { Product } from "../../models/Product.model";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrl: "./product-card.component.css",
})
export class ProductCardComponent {
  @Input() product:
    | Product
    | { _id: string; title: string; stock: number; price: number; fav: boolean; mainImg: string } = {
    _id: Math.random().toString(),
    title: "Beam XL",
    stock: 10,
    price: 100,
    fav: false,
    mainImg: "https://picsum.photos/200/300",
  };

  constructor(protected iconsService: IconsService) {}

  addToCartHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("cart", event);
  }

  addToFavoriteHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.product.fav = !this.product.fav;
  }
}
