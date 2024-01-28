import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { LayoutService } from "../services/layout.service";
import { Subscription } from "rxjs";

@Directive({
  selector: "[appLayout]",
})
export class LayoutDirective implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input("appLayout") key: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.subscription = this.layoutService.visibility.subscribe({
      next: (value) => {
        if (this.layoutService.display(this.key)) {
          this.mount();
        } else {
          this.unmount();
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  mount() {
    if (this.vcRef.length > 0) return;
    this.vcRef.createEmbeddedView(this.templateRef);
  }

  unmount() {
    this.vcRef.clear();
  }
}
