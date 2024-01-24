import { Directive, ElementRef, HostListener, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appCarouselFixer]",
})
export class CarouselFixerDirective implements OnInit {
  private timeoutId;

  @HostListener("window:resize", ["$event"])
  resizeHandler(delay = 200) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.hide();
      this.show();
    }, delay);
  }

  @HostListener("window:load", ["$event"])
  domLoadedHandler() {
    this.resizeHandler(300);
  }

  constructor(private elementRef: ElementRef, private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.show();
  }

  private show() {
    this.vcRef.createEmbeddedView(this.templateRef);
  }

  private hide() {
    this.vcRef.clear();
  }
}
