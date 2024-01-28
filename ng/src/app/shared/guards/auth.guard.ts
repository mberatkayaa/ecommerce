import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).user.value) {
    return inject(Router).parseUrl("/");
  }
  return true;
};
