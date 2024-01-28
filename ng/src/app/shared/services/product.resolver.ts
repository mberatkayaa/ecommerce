import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProductService } from "./product.service";
import { firstValueFrom } from "rxjs";
import { Product } from "../models/Product.model";

export const productResolver: ResolveFn<Product> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const productService = inject(ProductService);
  const result = await firstValueFrom<Product>(productService.getProduct(route.params.id));
  return result;
};
