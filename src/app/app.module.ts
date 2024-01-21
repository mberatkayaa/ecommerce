import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { DropdownTogglerDirective } from "./shared/directives/dropdown-toggler.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconsService } from "./shared/services/icons.service";
import { NavbarComponent } from "./navbar/navbar.component";

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomePageComponent, DropdownTogglerDirective, NavbarComponent],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [IconsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
