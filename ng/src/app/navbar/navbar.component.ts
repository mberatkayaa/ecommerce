import { Component, OnDestroy, OnInit } from "@angular/core";
import { Category } from "../shared/models/Category.model";
import { GroupService } from "../shared/services/group.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  groups: Array<{ name: string; value: string; categories: Array<Category> }> = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.refreshGroups().subscribe();
    this.subscription = this.groupService.groups.subscribe({
      next: (value) => {
        this.groups = value;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
