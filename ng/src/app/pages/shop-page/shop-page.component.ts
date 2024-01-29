import { Component, OnDestroy, OnInit } from "@angular/core";
import { GroupService } from "../../shared/services/group.service";
import { Category } from "../../shared/models/Category.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, Data, Params, Router } from "@angular/router";

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrl: "./shop-page.component.css",
})
export class ShopPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  groups: Array<{
    name: string;
    value: string;
    checked: boolean;
    categories: Array<{ category: Category; checked: boolean }>;
  }> = [];

  categorySlug: string = null;
  groupSlug: string = null;

  constructor(protected groupService: GroupService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.groupService.groups.subscribe({
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
        }
      },
    });
    this.route.params.subscribe({
      next: (params: Params) => {
        const grpId = params.grpId;
        const catSlug = params.catSlug;
        if (grpId) {
          this.groupSlug = grpId;
          if (this.groupService.groups.value && this.groupService.groups.value.length > 0)
            this.groups = this.groupService.groups.value
              .filter((x) => x.value === this.groupSlug)
              .map((x) => ({
                name: x.name,
                value: x.value,
                checked: false,
                categories: x.categories && x.categories.map((y) => ({ category: y, checked: false })),
              })) ;
          return;
        }
        if (catSlug) {
          this.categorySlug = catSlug;
        }
      },
    });
    if (this.categorySlug) return;
  }

  ngOnDestroy(): void {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}
