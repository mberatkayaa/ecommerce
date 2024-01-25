import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AuthPageComponent } from "./pages/auth-page/auth-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "signup", component: AuthPageComponent, data: { mode: "signup" } },
  { path: "signin", component: AuthPageComponent, data: { mode: "signin" } },
  { path: "**", component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
