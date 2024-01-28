import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { domain } from "../misc/constants";
import { Product } from "../models/Product.model";
import { HttpResult, PaginatedHttpResult } from "../misc/types";
import { map } from "rxjs";
import { httpErr, notifier } from "../misc/rxjsOperators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProduct(id: string) {
    return notifier(
      this.http.get<HttpResult<Product>>(domain + "products/" + id).pipe(httpErr("Ürün okunurken bir hata oluştu!"))
    );
  }

  addProduct(data: any) {
    return notifier(
      this.http
        .post<HttpResult<any>>(`${domain}admin/products/add`, data)
        .pipe(httpErr("Ürün oluşturulurken bir hata oluştu!")),
      true
    );
  }

  editProduct(data: any, id: string) {
    return notifier(
      this.http
        .patch<HttpResult<any>>(`${domain}admin/products/edit/${id}`, data)
        .pipe(httpErr("Ürün kaydedilirken bir hata oluştu!")),
      true
    );
  }

  getProducts(params: HttpParams) {
    return notifier(
      this.http
        .get<PaginatedHttpResult<Product>>(domain + "products", {
          params: params,
        })
        .pipe(httpErr("Ürünler okunurken bir hata oluştu!")),
      true
    );
  }
}
