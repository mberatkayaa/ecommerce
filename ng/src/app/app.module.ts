// Angular
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
// 3rd party
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CarouselModule } from "ngx-owl-carousel-o";
// Components
import { HeaderComponent } from "./header/header.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProductCardComponent } from "./shared/components/product-card/product-card.component";
import { ProductCarouselComponent } from "./shared/components/carousels/product-carousel/product-carousel.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";
// Directives
import { DropdownTogglerDirective } from "./shared/directives/dropdown-toggler.directive";
import { CarouselFixerDirective } from "./shared/directives/carousel-fixer.directive";
import { CarouselFixer2Directive } from "./shared/directives/carousel-fixer2.directive";
// Services
import { IconsService } from "./shared/services/icons.service";

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
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [IconsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
