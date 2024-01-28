import { Component, OnInit } from "@angular/core";
import { IconsService } from "../../shared/services/icons.service";
import { CategoryService } from "../../shared/services/category.service";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent implements OnInit {
  constructor(protected iconsService: IconsService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.refreshCategories().subscribe();
  }
}
