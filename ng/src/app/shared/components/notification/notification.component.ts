import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { INotification } from "../../misc/types";
import { NotificationHandlerService } from "../../services/notification-handler.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.css",
})
export class NotificationComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription;
  private elapsed: number = 0;

  @Input() notification: INotification;
  
  progress: string = "100";

  constructor(private notificationHandler: NotificationHandlerService) {}

  ngAfterViewInit(): void {
    if (this.notification) {
      if (this.notification.type !== "loading") {
        this.subscription = this.notificationHandler.tick.subscribe({
          next: (value) => {
            this.elapsed += value;
            const diff = this.notification.timeout - this.elapsed;
            this.progress = Math.max(0, Math.min(100, Math.floor((100 * diff) / this.notification.timeout))).toString();
            if (this.elapsed >= this.notification.timeout) {
              this.unsubscribe();
              this.notificationHandler.resolveNotification(this.notification);
            }
          },
        });
      }
    }
  }

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
