import { Directive, EventEmitter, HostListener, Input } from "@angular/core";

export interface ScreenBreakpointAttributeValue {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  default: string;
}

export interface ToggleAttribute {
  name: string;
  values: ScreenBreakpointAttributeValue;
}

@Directive({
  selector: "[appDeviceWidthBreakpoint]"
})
export class DeviceWidthBreakpointDirective {
  @Input() appDeviceWidthBreakpoint: EventEmitter<string>;
  private screenDeviceBreakpointLabel: string;
  private screenSize: number;

  constructor() {
  }

  @HostListener("window:resize", ["$event"]) onScreenResize($event): void {
    this.screenSize = $event.target.innerWidth;
    this.emitScreenDeviceBreakpointLabel();
  }

  private emitScreenDeviceBreakpointLabel() {
    if (this.screenSize >= 320 && this.screenSize <= 480) {
      this.screenDeviceBreakpointLabel = "sm";
    } else if (this.screenSize > 480 && this.screenSize <= 758) {
      this.screenDeviceBreakpointLabel = "md";
    } else if (this.screenSize > 768 && this.screenSize <= 1024) {
      this.screenDeviceBreakpointLabel = "lg";
    } else {
      this.screenDeviceBreakpointLabel = "xl";
    }
    this.appDeviceWidthBreakpoint.emit(this.screenDeviceBreakpointLabel);
  }
}
