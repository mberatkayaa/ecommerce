import { Component, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../shared/services/icons.service";
import { AuthService } from "../shared/services/auth.service";
import { User } from "../shared/models/User.model";
import { Subscription } from "rxjs";
import { CartService } from "../shared/services/cart.service";
import { Cart } from "../shared/models/Cart";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private cartSubscription: Subscription;

  user?: User;
  cart: Cart;

  constructor(
    protected iconsService: IconsService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    this.cartSubscription = this.cartService.cart.subscribe({
      next: (cart: Cart) => {
        this.cart = cart;
        console.log(cart);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = null;
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
      this.cartSubscription = null;
    }
  }

  signOutHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.authService.signOut();
  }

  removeCartItem(i: number) {
    const item = this.cart.items[i];
    this.cartService.toCart(item.product, 0, true);
  }
}
