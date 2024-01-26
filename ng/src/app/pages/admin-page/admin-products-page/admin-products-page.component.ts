import { Component } from "@angular/core";
import { IconsService } from "../../../shared/services/icons.service";

@Component({
  selector: "app-admin-products-page",
  templateUrl: "./admin-products-page.component.html",
  styleUrl: "./admin-products-page.component.css",
})
export class AdminProductsPageComponent {
  constructor(protected iconsService: IconsService) {}
}
