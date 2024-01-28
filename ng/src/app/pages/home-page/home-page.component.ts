import { Component} from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";


@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
})
export class HomePageComponent {
  customOptions: OwlOptions = {
    loop: true,
    center: true,
    items: 1,
    margin: 0,
    autoplay: true,
    dots: true,
    autoplayTimeout: 2500,
    smartSpeed: 450,
    nav: false,
    autoWidth: true,
    responsive: {},
  };
  prods = [];
}
