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

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomePageComponent, DropdownTogglerDirective, NavbarComponent],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule, BrowserAnimationsModule, CarouselModule],
  providers: [IconsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
