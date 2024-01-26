import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { ProductsComponent } from "./shared/components/products/products.component";
import { AdminProductsPageComponent } from "./pages/admin-page/admin-products-page/admin-products-page.component";
import { AdminAddProductPageComponent } from "./pages/admin-page/admin-add-product-page/admin-add-product-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "signup", component: AuthPageComponent, data: { mode: "signup" } },
  { path: "signin", component: AuthPageComponent, data: { mode: "signin" } },
  { path: "admin", component: AdminPageComponent, children:[
    {path:"products", component: AdminProductsPageComponent},
    {path:"products/add", component: AdminAddProductPageComponent},
    {path:"**", component:AdminPageComponent}
  ] },
  { path: "**", component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
