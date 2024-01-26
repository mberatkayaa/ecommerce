import { Component, OnDestroy, OnInit } from "@angular/core";
import { IconsService } from "../shared/services/icons.service";
import { AuthService } from "../shared/services/auth.service";
import { User } from "../shared/models/User.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;

  user?: User;

  constructor(protected iconsService: IconsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  signOutHandler(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.authService.signOut();
  }
}
