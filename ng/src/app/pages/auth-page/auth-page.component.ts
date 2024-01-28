import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { domain } from "../../shared/misc/constants";
import { IconsService } from "../../shared/services/icons.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import { AuthService } from "../../shared/services/auth.service";
import { HttpStreamResult } from "../../shared/misc/rxjsOperators";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrl: "./auth-page.component.css",
})
export class AuthPageComponent implements OnInit {
  mode: "signin" | "signup" = "signin";
  authForm: FormGroup;

  @ViewChild("loadingSwal", { static: true }) loadingSwal: SwalComponent;
  @ViewChild("errorSwal", { static: true }) errorSwal: SwalComponent;
  @ViewChild("successSwal", { static: true }) successSwal: SwalComponent;

  constructor(
    protected iconsService: IconsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data.mode;
    });

    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  showError(name: string): boolean {
    const control = this.authForm.get(name);
    return control.invalid && control.touched;
  }

  async submitHandler() {
    if (this.authForm.valid) {
      this.authService.auth(this.authForm.value["email"], this.authForm.value["password"], this.mode).subscribe({
        next: async (data: HttpStreamResult<any>) => {
          const { status, result } = data;
          if (status.loading) {
            this.loadingSwal.fire();
          } else if (status.completed) {
            await this.loadingSwal.close();
            await this.successSwal.fire();
          }
        },
        error: async (err: HttpStreamResult<any>) => {
          await this.loadingSwal.close();
          this.errorSwal.text = err.result.message;
          await this.errorSwal.fire();
        },
      });
    }
  }

  swalDidOpenHandler() {
    Swal.showLoading();
  }

  successDidCloseHandler() {
    this.router.navigate(["/"]);
  }
}
