import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  layout: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkStoredToken();
  }
}
