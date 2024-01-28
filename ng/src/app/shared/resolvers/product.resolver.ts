import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProductService } from "../services/product.service";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { Product } from "../models/Product.model";

export const productResolver: ResolveFn<Product> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const productService = inject(ProductService);
  const result = await lastValueFrom(productService.getProduct(route.params.id));
  if (result.status.error) {
    throw new Error(result.result.message);
  }
  return result.result.body;
};
