import { Directive, ElementRef, HostListener, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appBackToTop]",
})
export class BackToTopDirective {
  @Input("appBackToTop") scrollY: number = 200;

  @HostListener("window:scroll", ["$event"])
  resizeHandler() {
    if (window.scrollY >= this.scrollY) {
      this.show();
    } else {
      this.hide();
    }
  }

  constructor(private elementRef: ElementRef, private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) {}

  private show() {
    if (this.vcRef.length > 0) return;
    this.vcRef.createEmbeddedView(this.templateRef);
  }

  private hide() {
    if (this.vcRef.length > 0) this.vcRef.clear();
  }
}
