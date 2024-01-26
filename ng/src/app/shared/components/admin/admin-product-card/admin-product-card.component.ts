import { Component, Input } from "@angular/core";
import { Product } from "../../../models/Product.model";
import { IconsService } from "../../../services/icons.service";

@Component({
  selector: "app-admin-product-card",
  templateUrl: "./admin-product-card.component.html",
  styleUrl: "./admin-product-card.component.css",
})
export class AdminProductCardComponent {
  @Input() product:
    | Product
    | {
        _id: string;
        title: string;
        description: string;
        stock: number;
        price: number;
        unit: string;
        fav: boolean;
        mainImg: string;
      } = {
    _id: Math.random().toString(),
    title: "Beam XL",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae placerat urna. Cras dictum, velit imperdiet condimentum feugiat, dolor ex iaculis tellus, sed malesuada enim ex vel tortor. Ut ac ipsum risus. Sed odio massa, feugiat sed turpis luctus, pretium rhoncus sem. Curabitur eu sollicitudin lacus. Nunc sed sapien aliquam lorem posuere egestas eget nec magna. Nullam imperdiet eget quam eu mollis. Mauris ornare ex id aliquam suscipit.",
    stock: 10,
    price: 100,
    unit: "Adet",
    fav: false,
    mainImg: "https://picsum.photos/200/300",
  };

  constructor(protected iconsService: IconsService) {}
}
