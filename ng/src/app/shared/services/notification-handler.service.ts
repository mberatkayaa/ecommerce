import { EventEmitter, Injectable } from "@angular/core";
import { NavigationError, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { INotification } from "../misc/types";
import { splitUrl } from "../misc/helpers";

@Injectable({
  providedIn: "root",
})
export class NotificationHandlerService {
  private intervalId;

  notifications = new BehaviorSubject<Array<INotification>>([]);
  notificationResolved = new EventEmitter<INotification>();
  tick = new EventEmitter<number>();

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (value) => {
        if (value instanceof NavigationError) {
          console.log("error: ", value);
          const message: string = value.error.result.message;
          this.addNotification({ title: "Hata", description: message, type: "error" });
          this.redirect();
        }
      },
    });
    this.startTick();
  }

  redirect() {
    const { url, queryParams } = splitUrl(this.router.url);
    this.router.navigate([url], { queryParams });
  }

  addNotification(value: INotification): INotification {
    if (value && !value.timeout) value.timeout = 3000;
    if (value && !value.position) value.position = "side";
    this.notifications.next([...this.notifications.value, value]);
    return value;
  }

  resolveNotification(value: INotification) {
    this.notifications.next(this.notifications.value.filter((x) => x !== value));
    this.notificationResolved.emit(value);
  }

  startTick() {
    const ms = 50;
    this.pauseTick();
    this.intervalId = setInterval(() => {
      this.tick.emit(ms);
    }, ms);
  }

  pauseTick() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
