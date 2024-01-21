import { Component } from "@angular/core";
import { IconsService } from "../shared/services/icons.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {


  constructor(protected iconsService: IconsService){}
}
