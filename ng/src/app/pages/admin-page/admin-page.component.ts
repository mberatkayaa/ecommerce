import { Component } from "@angular/core";
import { IconsService } from "../../shared/services/icons.service";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {
  constructor(protected iconsService: IconsService) {}
}
