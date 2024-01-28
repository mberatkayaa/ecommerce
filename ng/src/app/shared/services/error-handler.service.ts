import { Injectable } from "@angular/core";
import { NavigationError, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  errors = new BehaviorSubject<Array<{ title: string; description: string }>>(null);

  constructor(private router: Router) {
    this.router.events.subscribe({
      next: (value) => {
        if (value instanceof NavigationError) {
          console.log("error: ", value);
          value.error.
        }
      },
    });
  }
}
