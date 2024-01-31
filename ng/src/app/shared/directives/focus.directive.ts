import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[appFocus]",
})
export class FocusDirective {
  private _focusIndex: number = -1;
  private _selectedFocusIndex: number = -1;

  @Input() set focusIndex(value: number) {
    this._focusIndex = value;
    this.check();
  }
  @Input() set selectedFocusIndex(value: number) {
    this._selectedFocusIndex = value;
    this.check();
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  private check() {
    if (this._focusIndex > -1) {
      if (this._focusIndex === this._selectedFocusIndex && this.elementRef) {
        this.elementRef.nativeElement.scrollIntoView();
        this.elementRef.nativeElement.focus();
      }
    }
  }
}
