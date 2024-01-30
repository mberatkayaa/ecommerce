import { Component, Input } from "@angular/core";

@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrl: "./drawer.component.css",
})
export class DrawerComponent {
  @Input() drawerName: string;
  @Input() rightSide: boolean = false;
}
