import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appDropdownToggler]",
})
export class DropdownTogglerDirective {
  @Input("appDropdownToggler") active: boolean = true;
  @Input() togglerShowClassName: string = "";
  @Input() dropdownShowClassName: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("mouseenter")
  mouseEnter(event) {
    if (!this.active) return;
    this.renderer.addClass(
      this.elementRef.nativeElement.querySelector("[data-toggler='true']")!,
      this.togglerShowClassName
    );
    this.renderer.addClass(
      this.elementRef.nativeElement.querySelector("[data-dropdown='true']")!,
      this.dropdownShowClassName
    );
  }

  @HostListener("mouseleave")
  mouseLeave(event) {
    if (!this.active) return;
    this.renderer.removeClass(
      this.elementRef.nativeElement.querySelector("[data-toggler='true']")!,
      this.togglerShowClassName
    );
    this.renderer.removeClass(
      this.elementRef.nativeElement.querySelector("[data-dropdown='true']")!,
      this.dropdownShowClassName
    );
  }
}
