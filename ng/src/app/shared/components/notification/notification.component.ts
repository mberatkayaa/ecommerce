import { AfterViewInit, Component, DoCheck, Input, OnDestroy, OnInit } from "@angular/core";
import { INotification } from "../../misc/types";
import { NotificationHandlerService } from "../../services/notification-handler.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.css",
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
  private subscription: Subscription;
  private elapsed: number = 0;
  private deactivate: boolean = false;

  @Input() notification: INotification;

  progress: string = "100";

  constructor(private notificationHandler: NotificationHandlerService) {}
  ngDoCheck(): void {
    if (this.deactivate) {
      this.deactivate = false;
      this.unsubscribe();
      this.notificationHandler.resolveNotification(this.notification);
    }
  }

  ngOnInit(): void {
    if (this.notification) {
      if (this.notification.type !== "loading") {
        this.subscription = this.notificationHandler.tick.subscribe({
          next: (value) => {
            if (this.deactivate) return;
            this.elapsed += value;
            const diff = this.notification.timeout - this.elapsed;
            this.progress = Math.max(0, Math.min(100, Math.floor((100 * diff) / this.notification.timeout))).toString();
            if (this.elapsed >= this.notification.timeout) {
              this.deactivate = true;
            }
          },
        });
      }
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
