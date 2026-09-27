import '@testing-library/jest-dom';

// Polyfill ResizeObserver for Radix UI components (Slider, ScrollArea) in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill PointerEvent for Radix UI primitives
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId?: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId;
    }
  }
  // @ts-expect-error polyfill
  global.PointerEvent = PointerEvent;
}
