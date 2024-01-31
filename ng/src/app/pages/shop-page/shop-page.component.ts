import { Component, OnDestroy, OnInit } from "@angular/core";
import { GroupService } from "../../shared/services/group.service";
import { Category } from "../../shared/models/Category.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, Data, Params, Router } from "@angular/router";
import { IconsService } from "../../shared/services/icons.service";
import { HttpClient } from "@angular/common/http";
import { ProductService } from "../../shared/services/product.service";
import { NotificationHandlerService } from "../../shared/services/notification-handler.service";
import { Product } from "../../shared/models/Product.model";
import { QueryParams } from "../../shared/misc/QueryParams";

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrl: "./shop-page.component.css",
})
export class ShopPageComponent implements OnInit, OnDestroy {
  private groupServiceSubscription: Subscription;
  private queryParamsSubscription: Subscription;

  // @Input("groups")
  // set groupsInput(
  //   value: Array<{
  //     name: string;
  //     value: string;
  //     checked: boolean;
  //     categories: Array<{ category: Category; checked: boolean }>;
  //   }>
  // ) {
  //   this.groups = value || [];
  //   // this.setCheckBoxes();
  //   // this.getProducts();
  // }

  categorySlug: string = null;
  groupSlug: string = null;

  groups: Array<{
    name: string;
    value: string;
    checked: boolean;
    categories: Array<{ category: Category; checked: boolean }>;
  }> = [];

  // Query params
  queryParams: QueryParams<{
    page: number;
    limit: number;
    inStock: boolean;
    sort: string;
    grps: string;
    cats: string;
    search: string;
    wide: boolean;
  }> = new QueryParams({
    page: 1,
    limit: 10,
    inStock: false,
    sort: null,
    grps: null,
    cats: null,
    search: null,
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
    private notificationHandler: NotificationHandlerService,
    private groupService: GroupService
  ) {}

  ngOnDestroy(): void {}

  clearSubscription() {
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
      this.groupServiceSubscription = null;
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
      this.queryParamsSubscription = null;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params: Params) => {
        this.groupSlug = params.grpId;
        this.categorySlug = params.catSlug;
        this.clearSubscription();
        this.groupServiceSubscription = this.groupService.groups.subscribe({
          next: (value) => {
            if (value && value.length > 0) {
              this.groups = value
                .filter((x) => !this.groupSlug || x.value === this.groupSlug)
                .map((x) => ({
                  name: x.name,
                  value: x.value,
                  checked: false,
                  categories: x.categories && x.categories.map((y) => ({ category: y, checked: false })),
                }));

              this.queryParamsSubscription = this.route.queryParams.subscribe({
                next: (value: {
                  page: string;
                  limit: string;
                  inStock: string;
                  sort: string;
                  grps: string;
                  cats: string;
                  search: string;
                  wide: string;
                  cold: string;
                }) => {
                  console.log("query", value);
                  this.queryParams.obj.page = +value.page || 1;
                  this.queryParams.obj.inStock = value.inStock === "true";
                  this.queryParams.obj.sort = value.sort;
                  this.queryParams.obj.wide = value.wide === "true";
                  this.queryParams.obj.grps = value.grps || null;
                  this.queryParams.obj.cats = value.cats || null;
                  this.queryParams.obj.search = value.search || null;

                  if (this.categorySlug) {
                    this.queryParams.obj.grps = null;
                    this.queryParams.obj.cats = null;
                  }

                  this.setCheckBoxes();

                  let limit = +value.limit || 10;
                  if (limit < this.limits[0] || limit > this.limits[this.limits.length - 1]) limit = this.limits[0];
                  this.queryParams.obj.limit = limit;
                  if (value.cold && this.products && this.products.length > 0) return;

                  this.getProducts();
                },
              });
            }
          },
        });
      },
    });
  }

  private getProducts() {
    let httpParams = this.queryParams.httpParams();
    if (this.categorySlug) {
      httpParams = httpParams.set("cats", this.categorySlug);
    } else {
      httpParams = httpParams.set("grpLimit", this.getQueryForGroupLimit());
    }

    this.productService.getProducts(httpParams).subscribe({
      next: (value) => {
        const { status, result, bag } = value;
        if (status.loading) {
          value.setBag(
            this.notificationHandler.addNotification({
              type: "loading",
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
  }

  private setCheckBoxes() {
    if (this.queryParams.obj.grps) {
      this.queryParams.obj.grps.split(",").forEach((x) => {
        this.grpCheckedChanged(x, true, true);
      });
    }

    if (this.queryParams.obj.cats) {
      this.queryParams.obj.cats.split(",").forEach((x) => {
        this.catCheckedChanged(x, true, true);
      });
    }
  }

  grpCheckedChanged(id, noQuery: boolean = false, value: boolean = false) {
    console.log("grp combo: ", id);
    const obj = this.groups.find((x) => x.value === id);
    if (obj) {
      obj.checked = noQuery ? value : !obj.checked;
      if (noQuery) return;
      this.queryParams.setPermanent({
        grps: this.groups
          .filter((x) => x.checked)
          .map((x) => x.value)
          .join(","),
      });
    }
  }

  catCheckedChanged(id, noQuery: boolean = false, value: boolean = false) {
    console.log("cat combo: ", id);
    for (let i = 0; i < this.groups.length; i++) {
      const grp = this.groups[i];
      if (grp.categories && grp.categories.length > 0) {
        const obj = grp.categories.find((x) => x.category.slug === id);
        if (obj) {
          obj.checked = noQuery ? value : !obj.checked;
          if (noQuery) return;
          let arr = [];
          this.groups.forEach((x) => {
            arr.push(...x.categories.filter((y) => y.checked).map((y) => y.category.slug));
          });
          this.queryParams.setPermanent({ cats: arr.join(",") });
          break;
        }
      }
    }
  }

  getQueryForGroupLimit(): string {
    let result = "";
    if (this.groups && this.groups.length > 0) {
      result = this.groups.map((x) => x.value).join(",");
    }
    return result;
  }

  selectedChanged(value) {
    this.router.navigate(["./"], { relativeTo: this.route, queryParams: this.queryParams.set({ sort: value }) });
  }

  applyFilterHandler() {
    this.router.navigate(["./"], { relativeTo: this.route, queryParams: this.queryParams.obj });
  }
}
