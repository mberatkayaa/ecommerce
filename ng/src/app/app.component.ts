import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LayoutInfo, createLayoutInfos } from "./shared/misc/LayoutInfo";
import { LayoutService } from "./shared/services/layout.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { NotificationHandlerService } from "./shared/services/notification-handler.service";
import { INotification } from "./shared/misc/types";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit, OnDestroy {
  private activeLoadingNotification?: INotification;
  private subscription: Subscription;

  sideNotifications: Array<INotification> = [];
  middleNotifications: Array<INotification> = [];

  constructor(private authService: AuthService, private notificationHandler: NotificationHandlerService) {}
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  ngOnInit(): void {
    this.authService.checkStoredToken();

    this.subscription = this.notificationHandler.notifications.subscribe({
      next: (value) => {
        this.sideNotifications = value.filter((x) => x.position === "side").reverse();
        this.middleNotifications = value.filter((x) => x.position === "middle").reverse();
      },
    });
  }

  swalDidOpenHandler() {
    Swal.showLoading();
  }
}
