// Angular
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
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
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { AuthInterceptorService } from "./shared/services/auth-interceptor.service";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { ProductsComponent } from "./shared/components/products/products.component";
import { AdminProductCardComponent } from "./shared/components/admin/admin-product-card/admin-product-card.component";
import { AdminProductsPageComponent } from "./pages/admin-page/admin-products-page/admin-products-page.component";
import { AdminAddProductPageComponent } from "./pages/admin-page/admin-add-product-page/admin-add-product-page.component";
import { AdminCategoriesPageComponent } from "./pages/admin-page/admin-categories-page/admin-categories-page.component";
import { CategoryRowComponent } from "./pages/admin-page/admin-categories-page/category-row.component";
import { LayoutService } from "./shared/services/layout.service";
import { LayoutDirective } from './shared/directives/layout.directive';
import { FileNamePipe } from './shared/pipes/file-name.pipe';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { NotificationTickDirective } from './shared/directives/notification-tick.directive';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

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
    AdminPageComponent,
    ProductsComponent,
    AdminProductCardComponent,
    AdminProductsPageComponent,
    AdminAddProductPageComponent,
    AdminCategoriesPageComponent,
    CategoryRowComponent,
    LayoutDirective,
    FileNamePipe,
    NotificationComponent,
    NotificationTickDirective,
    ShopPageComponent,
    ProductDetailPageComponent,
    CartPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
  ],
  providers: [
    IconsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    LayoutService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
