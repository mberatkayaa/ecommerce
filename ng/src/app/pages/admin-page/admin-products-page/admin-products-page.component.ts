import { Component, OnInit } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../../shared/models/Product.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedHttpResult } from "../../../shared/misc/types";
import { domain } from "../../../shared/misc/constants";
import { QueryParams } from "../../../shared/misc/QueryParams";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationHandlerService } from "../../../shared/services/notification-handler.service";

@Component({
  selector: "app-admin-products-page",
  templateUrl: "./admin-products-page.component.html",
  styleUrl: "./admin-products-page.component.css",
})
export class AdminProductsPageComponent implements OnInit {
  // Query params
  queryParams: QueryParams<{
    page: number;
    limit: number;
    inStock: boolean;
    sort: string;
    wide: boolean;
  }> = new QueryParams({
    page: 1,
    limit: 10,
    inStock: false,
    sort: null,
    wide: false,
  });

  totalPages: number = 1;
  products: Array<Product> = [];
  totalDocs: number = 0;

  limits = [1, 3, 5, 10, 15, 20];
  pageButtons = [];

  private setPageButtons() {
    const result: Array<number | string> = [1];
    const page = this.queryParams.obj.page;
    if (page - 2 >= 2) result.push("...");
    if (page - 1 > 1 && page - 1 < this.totalPages) result.push(page - 1);
    if (page > 1 && page < this.totalPages) result.push(page);
    if (page + 1 > 1 && page + 1 < this.totalPages) result.push(page + 1);
    if (this.totalPages - page - 1 >= 2) result.push("...");
    if (this.totalPages > 1) result.push(this.totalPages);
    this.pageButtons = result;
  }

  constructor(
    protected iconsService: IconsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService,
    private notificationHandler: NotificationHandlerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (value: { page: string; limit: string; inStock: string; sort: string; wide: string; cold: string }) => {
        console.log("query", value);
        this.queryParams.obj.page = +value.page || 1;
        this.queryParams.obj.inStock = value.inStock === "true";
        this.queryParams.obj.sort = value.sort;
        this.queryParams.obj.wide = value.wide === "true";

        let limit = +value.limit || 10;
        if (limit < this.limits[0] || limit > this.limits[this.limits.length - 1]) limit = this.limits[0];
        this.queryParams.obj.limit = limit;
        if (value.cold) return;

        this.productService.getProducts(this.queryParams.httpParams()).subscribe({
          next: (value) => {
            const { status, result, bag } = value;
            if (status.loading) {
              value.setBag(
                this.notificationHandler.addNotification({
                  type: "notification",
                  title: "Okunuyor",
                  description: "Ürünler okunuyor.",
                })
              );
            } else if (status.completed) {
              if (bag) {
                this.notificationHandler.resolveNotification(bag);
              }

              this.totalPages = result.body.totalPages;
              this.products = result.body.docs;
              this.totalDocs = result.body.totalDocs;
              this.setPageButtons();
            }
          },
          error: (value) => {
            const { bag } = value;
            if (bag) {
              this.notificationHandler.resolveNotification(bag);
            }
            this.notificationHandler.addNotification({
              type: "error",
              title: "Hata!",
              description: "Ürünler okunurken bir sorun oluştu!",
            });
          },
        });
        //   this.http
        //     .get<PaginatedHttpResult<Product>>(domain + "products", {
        //       params: this.queryParams.httpParams(),
        //     })
        //     .subscribe({
        //       next: (result) => {
        //         this.totalPages = result.body.totalPages;
        //         this.products = result.body.docs;
        //         this.totalDocs = result.body.totalDocs;
        //         this.setPageButtons();
        //       },
        //     });
      },
    });
  }

  selectedChanged(value) {
    this.router.navigate(["./"], { relativeTo: this.route, queryParams: this.queryParams.set({ sort: value }) });
  }
}
