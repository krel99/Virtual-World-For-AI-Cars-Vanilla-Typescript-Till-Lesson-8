import type { PointDrawOptions, PointClass } from "./primitiveTypes.ts";
import type { MathPoint } from "../math/mathTypes.ts";

/**
 * Represents a point in 2D space Cartesian coordinate space
 * @constructor Creates a new instance of Point with the specified x and y coordinates.
 * @method equals Determines if another point is equal to THIS one.
 * @method draw Draws this point on a canvas context.
 * @implements {PointClass}
 */
class Point implements PointClass {
  constructor(public x: number, public y: number) {}

  /**
   * Determines if another point is equal to THIS one.
   *
   * @type {(point: MathPoint) => boolean}
   */
  equals(point: MathPoint): boolean {
    return this.x === point.x && this.y === point.y;
  }

  /**
   * Draws this point on a canvas context.
   *
   * @param ctx The canvas rendering context to draw the point on.
   * @param options (Optional) Options for drawing the point incl.: size (18px), color (black), outline (false), fill (false).
   */
  draw(ctx: CanvasRenderingContext2D, { size = 18, color = "black", outline = false, fill = false }: PointDrawOptions = {}): void {
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
    ctx.fill();

    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, rad * 0.6, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 0.4, 0, 2 * Math.PI);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}

export default Point;
