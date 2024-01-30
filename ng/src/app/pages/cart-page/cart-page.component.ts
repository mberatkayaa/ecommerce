import { Component, OnDestroy, OnInit } from "@angular/core";
import { Cart } from "../../shared/models/Cart";
import { ActivatedRoute, Data } from "@angular/router";
import { CartService } from "../../shared/services/cart.service";
import { IconsService } from "../../shared/services/icons.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrl: "./cart-page.component.css",
})
export class CartPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  cart: Cart;

  constructor(private route: ActivatedRoute, private cartService: CartService, protected iconsService: IconsService) {}

  ngOnInit(): void {
    this.subscription = this.cartService.cart.subscribe({
      next: (value) => {
        this.cart = value;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  removeCartItem(i: number) {
    const item = this.cart.items[i];
    this.cartService.toCart(item.product, 0, true).subscribe();
  }

  clearHandler() {
    this.cartService.clear().subscribe();
  }
}
