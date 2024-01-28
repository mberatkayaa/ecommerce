import { Directive, HostListener } from "@angular/core";
import { NotificationHandlerService } from "../services/notification-handler.service";

@Directive({
  selector: "[appNotificationTick]",
})
export class NotificationTickDirective {
  @HostListener("mouseenter")
  mouseEnter() {
    this.notificationHandler.pauseTick();
  }

  @HostListener("mouseleave")
  mouseLeave() {
    this.notificationHandler.startTick();
  }

  @HostListener("window:touchstart", ["$event"])
  @HostListener("window:touchend", ["$event"])
  @HostListener("window:touchcancel", ["$event"])
  touch(event: TouchEvent) {
    if (event.touches.length > 0) this.notificationHandler.pauseTick();
    else this.notificationHandler.startTick();
  }

  constructor(private notificationHandler: NotificationHandlerService) {}
}
