import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { domain } from "../../shared/misc/constants";
import { IconsService } from "../../shared/services/icons.service";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrl: "./auth-page.component.css",
})
export class AuthPageComponent implements OnInit {
  mode: "signin" | "signup" = "signin";
  authForm: FormGroup;

  constructor(protected iconsService:IconsService, private route: ActivatedRoute, private http: HttpClient) {}

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

  submitHandler() {
    if (this.authForm.valid) {
      const url = domain + this.mode;
      this.http.post(url, this.authForm.value).subscribe((data) => console.log(data));
    }
  }
}
