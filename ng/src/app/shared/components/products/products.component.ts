import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css",
})
export class ProductsComponent {
  @Input() isAdmin: boolean = false;
  @Input() products;
  @Input() wide: boolean = false;
  @Output() onDelete = new EventEmitter<string>();
}
