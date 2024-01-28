import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";

export const adminGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  if (authService.user.value === null) {
    // alert("Bu sayfaya giriş için oturum açınız!");
    // const email = prompt("Email: ");
    // const password = prompt("Parola: ");
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    const dialogResult = await Swal.fire<{
      email: string;
      password: string;
    }>({
      title: "Login Form",
      html: `
    <input type="text" id="email" class="swal2-input" placeholder="Email">
    <input type="password" id="password" class="swal2-input" placeholder="Parola">
  `,
      confirmButtonText: "Sign in",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        emailInput = popup.querySelector("#email") as HTMLInputElement;
        passwordInput = popup.querySelector("#password") as HTMLInputElement;
        emailInput.onkeyup = (event) => event.key === "Enter" && Swal.clickConfirm();
        passwordInput.onkeyup = (event) => event.key === "Enter" && Swal.clickConfirm();
      },
      preConfirm: () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (!email || !password) {
          Swal.showValidationMessage(`Lütfen geçerli bir email ve parola giriniz!`);
        }
        return { email, password };
      },
    });
    const { email, password } = dialogResult.value;
    const result = await firstValueFrom<any>(authService.isAdmin(email, password));
  } else {
    const result = await firstValueFrom<any>(authService.isAdmin());
  }
  return true;
};
