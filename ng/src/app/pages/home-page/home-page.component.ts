import { Component, OnInit } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import { ProductService } from "../../shared/services/product.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
})
export class HomePageComponent implements OnInit {
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
  products = [];
  products2 = [];

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        const prods1 = [];
        const prods2 = [];
        data.products.forEach((value, index, arr) => {
          if (index <= arr.length / 2) prods1.push(value);
          else prods2.push(value);
        });
        this.products = prods1;
        this.products2 = prods2;
      },
    });
  }
}
