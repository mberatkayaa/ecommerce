import { AfterViewInit, ComponentRef, Directive, ElementRef, HostBinding, HostListener, Input } from "@angular/core";
import { CarouselComponent, OwlOptions } from "ngx-owl-carousel-o";

@Directive({
  selector: "[appCarouselFixer2]",
})
export class CarouselFixer2Directive implements AfterViewInit {
  private timeoutId;
  private _opts: OwlOptions;

  @Input("appCarouselFixer2") set opts(value: OwlOptions) {
    this._opts = value;
    this.refresh();
  }
  @Input() loop: boolean;

  @HostListener("window:resize", ["$event"])
  resizeHandler() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.refresh();
    }, 200);
  }

  // @HostListener("document:DOMContentLoaded", ["$event"])
  // domLoaded() {
  //   this.resizeHandler();
  // }

  constructor(private elementRef: ElementRef, private carousel: CarouselComponent) {}

  ngAfterViewInit(): void {
    // new ResizeObserver(() => {
    //   this.resizeHandler();
    // }).observe(this.elementRef.nativeElement);
  }

  refresh() {
    this.carousel.options = { ...this._opts, loop: !this.loop };
    this.carousel.options = { ...this._opts, loop: this.loop };
    this.carousel.ngOnInit();
    this.carousel.ngOnChanges();
  }
}
