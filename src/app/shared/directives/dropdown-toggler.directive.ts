import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appDropdownToggler]",
})
export class DropdownTogglerDirective {
  @Input("appDropdownToggler") dropdown: HTMLElement;
  @Input() toggler: HTMLElement;
  @Input() togglerShowClassName: string = "";
  @Input() dropdownShowClassName: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("mouseenter")
  mouseEnter(event) {
    this.renderer.addClass(
      this.elementRef.nativeElement.querySelector("[data-toggler='true']")!,
      this.togglerShowClassName
    );
    this.renderer.addClass(
      this.elementRef.nativeElement.querySelector("[data-dropdown='true']")!,
      this.dropdownShowClassName
    );
    // if (!this.dropdown || !this.toggler) return;
    // this.renderer.addClass(this.toggler, this.togglerShowClassName);
    // this.renderer.addClass(this.dropdown, this.dropdownShowClassName);
  }

  @HostListener("mouseleave")
  mouseLeave(event) {
    this.renderer.removeClass(
      this.elementRef.nativeElement.querySelector("[data-toggler='true']")!,
      this.togglerShowClassName
    );
    this.renderer.removeClass(
      this.elementRef.nativeElement.querySelector("[data-dropdown='true']")!,
      this.dropdownShowClassName
    );
    // if (!this.dropdown || !this.toggler) return;
    // this.renderer.removeClass(this.toggler, this.togglerShowClassName);
    // this.renderer.removeClass(this.dropdown, this.dropdownShowClassName);
  }
}
