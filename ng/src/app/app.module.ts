import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { DropdownTogglerDirective } from "./shared/directives/dropdown-toggler.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconsService } from "./shared/services/icons.service";
import { NavbarComponent } from "./navbar/navbar.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { CarouselFixerDirective } from "./shared/directives/carousel-fixer.directive";
import { ProductCardComponent } from "./shared/components/product-card/product-card.component";
import { CarouselFixer2Directive } from "./shared/directives/carousel-fixer2.directive";
import { ProductCarouselComponent } from "./shared/components/carousels/product-carousel/product-carousel.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    DropdownTogglerDirective,
    NavbarComponent,
    CarouselFixerDirective,
    ProductCardComponent,
    CarouselFixer2Directive,
    ProductCarouselComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule, BrowserAnimationsModule, CarouselModule],
  providers: [IconsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
