import { Component, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";
import { CategoryService } from "../../../shared/services/category.service";
import { Category } from "../../../shared/models/Category.model";
import { Subscription } from "rxjs";
import { NotificationHandlerService } from "../../../shared/services/notification-handler.service";

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

  constructor(
    protected iconsService: IconsService,
    private categoryService: CategoryService,
    private notificationHandler: NotificationHandlerService
  ) {}

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
        const { status, result, bag } = value;
        if (status.loading) {
          value.setBag(
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Oluşturuluyor",
              description: "Kategori oluşturuluyor.",
            })
          );
        } else if (status.completed) {
          this.enteredTitle = "";
          if (bag) {
            this.notificationHandler.resolveNotification(bag);
          }
          if (status.error) {
            this.notificationHandler.addNotification({
              type: "error",
              title: "Hata!",
              description: result.message,
            });
          }
          if (status.done) {
            this.notificationHandler.addNotification({
              type: "notification",
              title: "Başarılı!",
              description: "Kategori başarıyla oluşturuldu!",
            });
          }
        }
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
