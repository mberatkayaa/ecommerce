import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { domain } from "../misc/constants";
import { Product } from "../models/Product.model";
import { HttpResult } from "../misc/types";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProduct(id: string) {
    return this.http.get<HttpResult<Product>>(domain + "products/" + id).pipe<Product | null>(
      map((value) => {
        return !value || !value.body ? null : value.body;
      })
    );
  }
}
