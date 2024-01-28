import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LayoutInfo, createLayoutInfos } from "./shared/misc/LayoutInfo";
import { LayoutService } from "./shared/services/layout.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  layout = createLayoutInfos([
    {
      path: "/",
      visibility: { header: true, navbar: true },
      children: [
        {
          path: "signin",
          visibility: { navbar: false },
        },
        {
          path: "signup",
          visibility: { header: false },
        },
      ],
    },
  ]);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkStoredToken();
  }
}
