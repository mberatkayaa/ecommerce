import { ResolveFn } from "@angular/router";
import { Product } from "../models/Product.model";
import { inject } from "@angular/core";
import { ProductService } from "../services/product.service";
import { lastValueFrom } from "rxjs";
import { HttpParams } from "@angular/common/http";

export const carouselProductsResolver: ResolveFn<Array<Product>> = async (route, state) => {
  const productService = inject(ProductService);
  const result = await lastValueFrom(
    productService.getProducts(new HttpParams().set("limit", 10).set("inStock", true))
  );
  if (result.status.error) {
    throw new Error(result.result.message);
  }
  return result.result.body.docs;
};
