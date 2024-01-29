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

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
  },
  { path: "signup", canActivate: [authGuard], component: AuthPageComponent, data: { mode: "signup" } },
  { path: "signin", canActivate: [authGuard], component: AuthPageComponent, data: { mode: "signin" } },
  { path: "shop", component: ShopPageComponent },
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
      { path: "**", component: AdminPageComponent },
    ],
  },
  { path: "**", component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
