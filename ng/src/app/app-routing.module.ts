import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { AdminProductsPageComponent } from "./pages/admin-page/admin-products-page/admin-products-page.component";
import { AdminAddProductPageComponent } from "./pages/admin-page/admin-add-product-page/admin-add-product-page.component";
import { AdminCategoriesPageComponent } from "./pages/admin-page/admin-categories-page/admin-categories-page.component";
import { productResolver } from "./shared/resolvers/product.resolver";
import { adminGuard } from "./shared/guards/admin.guard";
import { authGuard } from "./shared/guards/auth.guard";
import { ShopPageComponent } from "./pages/shop-page/shop-page.component";
import { ProductDetailPageComponent } from "./pages/product-detail-page/product-detail-page.component";
import { CartPageComponent } from "./pages/cart-page/cart-page.component";
import { cartResolver } from "./shared/resolvers/cart.resolver";
import { carouselProductsResolver } from "./shared/resolvers/carousel-products.resolver";
import { ProductSearchBarComponent } from "./shared/components/product-search-bar/product-search-bar.component";

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
    resolve: { products: carouselProductsResolver },
  },
  { path: "signup", canActivate: [authGuard], component: AuthPageComponent, data: { mode: "signup" } },
  { path: "signin", canActivate: [authGuard], component: AuthPageComponent, data: { mode: "signin" } },
  { path: "shop", component: ShopPageComponent },
  { path: "grp/:grpId", component: ShopPageComponent },
  { path: "cat/:catSlug", component: ShopPageComponent },
  {
    path: "prod/:id",
    component: ProductDetailPageComponent,
    data: { bySlug: true },
    resolve: { product: productResolver },
  },
  {
    path: "cart",
    component: CartPageComponent,
    resolve: { cart: cartResolver },
  },
  { path: "admin", redirectTo: "admin/products", pathMatch: "full" },
  {
    path: "admin",
    canActivate: [adminGuard],
    component: AdminPageComponent,
    children: [
      { path: "products", component: AdminProductsPageComponent },
      { path: "products/add", component: AdminAddProductPageComponent },
      {
        path: "products/edit/:id",
        component: AdminAddProductPageComponent,
        data: { edit: true },
        resolve: { product: productResolver },
      },
      { path: "categories", component: AdminCategoriesPageComponent },
    ],
  },
  { path: "**", component: ProductSearchBarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
