import { Component, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";
import { CategoryService } from "../../../shared/services/category.service";
import { Category } from "../../../shared/models/Category.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-admin-categories-page",
  templateUrl: "./admin-categories-page.component.html",
  styleUrl: "./admin-categories-page.component.css",
})
export class AdminCategoriesPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  enteredGroup: string = "mousePad";
  enteredTitle: string = "";
  categories: Array<Category> = [];

  constructor(protected iconsService: IconsService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.subscription = this.categoryService.categories.subscribe({
      next: (value) => {
        this.categories = value;
      },
    });

    this.categoryService.refreshCategories().subscribe();
  }
  ngOnDestroy(): void {
    this.clearSubscription();
  }

  createCategoryHandler() {
    this.categoryService.addCategory(this.enteredGroup, this.enteredTitle).subscribe({
      next: (value) => {
        this.enteredTitle = "";
      },
    });
  }

  clearSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
