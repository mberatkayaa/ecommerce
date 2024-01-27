import { AfterViewInit, Component, HostListener, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { CarouselComponent, OwlOptions } from "ngx-owl-carousel-o";
import { Product } from "../../shared/models/Product.model";

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
