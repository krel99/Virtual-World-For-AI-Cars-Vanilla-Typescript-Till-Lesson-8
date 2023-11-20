import Point from "./primitives/point";
import { PointClass } from "./types/primitiveTypes.ts";
import { add, substract, scale } from "./math/utils";
import type { viewPort } from "./types/types.ts";

export class Viewport implements viewPort {
  zoom: number = 1;
  center: PointClass;
  offset: PointClass;
  drag: {
    start: PointClass;
    end: PointClass;
    offset: PointClass;
    activelyDragging: boolean;
  };

  constructor(public canvas: HTMLCanvasElement, public ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drag = { start: new Point(0, 0), end: new Point(0, 0), offset: new Point(0, 0), activelyDragging: false }; //action === activelyDragging
    this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.canvas.addEventListener("wheel", (evt: WheelEvent) => this.handleWheel(evt));
    this.canvas.addEventListener("mousedown", (evt: MouseEvent) => this.handleMouseDown(evt));
    this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
    this.canvas.addEventListener("mousemove", (evt: MouseEvent) => this.handleMouseMove(evt));
  }

  /**
   * Retrieves the mouse position relative to the viewport, accounting for the current zoom and offset.
   * @param evt - The MouseEvent to get the coordinates from.
   * @param substractDragOffset - Indicates whether to substract the current drag offset from the mouse position.
   * @returns {PointClass} The transformed mouse position as a PointClass instance.
   */
  getMouse(evt: MouseEvent, substractDragOffset: boolean = false) {
    const p = new Point(
      (evt.offsetX - this.center.x) * this.zoom - this.offset.x,
      (evt.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    return substractDragOffset ? substract(p, this.drag.offset) : p;
  }

  /**
   * Retrieves the current offset, including any drag offset.
   * @returns {PointClass} The total offset as a PointClass instance.
   */
  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  /**
   * Handles the mouse down event, initiating a drag operation if the middle mouse button is pressed.
   * @param evt - The MouseEvent triggered by pressing the mouse button.
   */
  private handleMouseDown(evt: MouseEvent): void {
    if (evt.button === 1) {
      this.drag.start = this.getMouse(evt);
      this.drag.activelyDragging = true;
    }
  }

  /**
   * Handles the mouse move event, updating the drag offset if a drag operation is in progress.
   * @param evt - The MouseEvent triggered by moving the mouse.
   */
  private handleMouseMove(evt: MouseEvent): void {
    if (this.drag.activelyDragging) {
      this.drag.end = this.getMouse(evt);
      this.drag.offset = substract(this.drag.end, this.drag.start);
    }
  }
  /**
   * Handles the mouse up event, finalizing a drag operation and resetting drag state.
   * @param evt - The MouseEvent triggered by releasing the mouse button.
   * ! it is unclear if evt will be used in future lessons, but for now it is redundant
   */
  private handleMouseUp(): void {
    if (this.drag.activelyDragging) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = { start: new Point(0, 0), end: new Point(0, 0), offset: new Point(0, 0), activelyDragging: false };
    }
  }

  /**
   * Handles the wheel event, adjusting the zoom level of the viewport.
   * @param evt - The WheelEvent triggered by moving the mouse wheel.
   */
  private handleWheel(evt: WheelEvent): void {
    const dir = Math.sign(evt.deltaY);
    this.zoom += dir * 0.1;
    this.zoom = Math.max(1, Math.min(10, this.zoom));
  }

  /**
   * Resets the viewport to its default state, clearing any transformations applied to the canvas.
   */
  reset(): void {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }
}
