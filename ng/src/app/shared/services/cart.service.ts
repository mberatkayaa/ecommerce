import { Injectable } from "@angular/core";
import { BehaviorSubject, map, takeLast, tap } from "rxjs";
import { Cart, RawCart } from "../models/Cart";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { HttpResult } from "../misc/types";
import { domain } from "../misc/constants";
import { HttpStreamResult, httpErr, httpNext, notifier } from "../misc/rxjsOperators";
import { User } from "../models/User.model";
import { Product } from "../models/Product.model";
import { NotificationHandlerService } from "./notification-handler.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cart = new BehaviorSubject<Cart>(this.rawCartToCart());

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationHandler: NotificationHandlerService
  ) {
    this.authService.user.subscribe({
      next: (value: User) => {
        if (value) this.refreshCart().subscribe();
        else this.cart.next(this.rawCartToCart());
      },
    });
  }

  refreshCart() {
    return this.http.get<HttpResult<RawCart>>(domain + "cart").pipe(
      httpNext(),
      map((value) => {
        const rawCart = value.body;
        return { ...value, body: this.rawCartToCart(rawCart) };
      }),
      tap({
        next: (data: HttpResult<Cart>) => {
          this.cart.next(data.body);
        },
      })
    );
  }

  toCart(item: Product, quantity: number, exact: boolean = false) {
    if (!item) {
      this.notificationHandler.addNotification({ title: "Hata", description: "Ürün bulunamadı!", type: "error" });
      return;
    }
    if (!exact) {
      if (item.stock <= 0) {
        this.notificationHandler.addNotification({
          title: "Hata",
          description: "Stokta olmayan ürünler sepete eklenemez!",
          type: "error",
        });
        return;
      }
      if (item.stock < quantity) {
        this.notificationHandler.addNotification({
          title: "Hata",
          description: "Stok miktarından fazla sayıda ürün sepete eklenemez!",
          type: "error",
        });
        return;
      }
    }
    return notifier(
      this.http
        .post<HttpResult<RawCart>>(
          domain + "cart",
          { item, quantity },
          {
            params: {
              exact: exact,
            },
          }
        )
        .pipe(httpErr("Ürün sepete eklenemedi"))
    ).pipe(
      takeLast(1),
      map((value) => {
        const { result } = value;
        return { ...value, result: { ...result, body: this.rawCartToCart(result.body) } };
      }),
      tap({
        next: (data: HttpStreamResult<Cart>) => {
          this.cart.next(data.result.body);
        },
      })
    );
  }

  clear() {
    return notifier(this.http.delete<HttpResult<RawCart>>(domain + "cart/clear").pipe(httpNext())).pipe(
      takeLast(1),
      map((value) => {
        const { result } = value;
        return { ...value, result: { ...result, body: this.rawCartToCart(result.body) } };
      }),
      tap({
        next: (data: HttpStreamResult<Cart>) => {
          this.cart.next(data.result.body);
        },
      })
    );
  }

  private rawCartToCart(rawCart?: RawCart) {
    const cart: Cart = { items: [], totalItemCount: 0, totalPrice: 0 };
    if (rawCart && rawCart.length > 0) {
      for (let i = 0; i < rawCart.length; i++) {
        const cartItem = { ...rawCart[i], totalPrice: 0 };
        if (!cartItem.product) continue;
        cartItem.totalPrice = cartItem.product.price * cartItem.quantity;
        cart.totalItemCount += cartItem.quantity;
        cart.totalPrice += cartItem.totalPrice;
        cart.items.push(cartItem);
      }
    }
    return cart;
  }
}
