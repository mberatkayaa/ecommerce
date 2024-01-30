import { ResolveFn } from "@angular/router";
import { Cart } from "../models/Cart";
import { inject } from "@angular/core";
import { CartService } from "../services/cart.service";
import { firstValueFrom, lastValueFrom } from "rxjs";

export const cartResolver: ResolveFn<Cart> = async (route, state) => {
  const cartService = inject(CartService);
  const result = await firstValueFrom(cartService.refreshCart());
  if (result.error) throw { result };
  return result.body;
};
