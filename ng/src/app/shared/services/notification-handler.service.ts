import { Injectable } from "@angular/core";
import { NavigationError, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { INotification } from "../misc/types";

@Injectable({
  providedIn: "root",
})
export class NotificationHandlerService {
  notifications = new BehaviorSubject<Array<INotification>>([]);

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (value) => {
        if (value instanceof NavigationError) {
          console.log("error: ", value);
          // value.error.
        }
      },
    });
  }

  addNotification(value: INotification): INotification {
    this.notifications.next([...this.notifications.value, value]);
    return value;
  }

  resolveNotification(value: INotification) {
    this.notifications.next(this.notifications.value.filter((x) => x !== value));
  }
}
