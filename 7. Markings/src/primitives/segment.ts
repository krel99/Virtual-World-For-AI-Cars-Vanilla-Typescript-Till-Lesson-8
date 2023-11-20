import type { SegmentDrawOptions, PointClass, SegmentClass } from "../types/primitiveTypes";
import { distance, magnitude, add, normalize, substract, scale, dot } from "../math/utils";
import { MathPoint } from "../types/mathTypes";

/**
 * Represents a line segment defined by two endpoints in 2D Cartesian coordinate space.
 *
 * @constructor Creates a new instance of Segment with the specified starting point (p1) and ending point (p2).
 * @method equals Determines if another segment is equal to THIS one based on the endpoints.
 * @method includes Checks if a given point is one of the endpoints of THIS segment.
 * @method draw Draws this segment on a canvas context.
 * @implements {SegmentClass}
 */
class Segment implements SegmentClass {
  constructor(public p1: PointClass, public p2: PointClass) {}

  /**
   * Determines if another segment is equal to this one by comparing their endpoints.
   * @param seg - Another segment to compare with this instance.
   * @returns `true` if both segments have the same endpoints, `false` otherwise.
   */
  equals(seg: SegmentClass): boolean {
    return this.includes(seg.p1) && this.includes(seg.p2);
  }

  /**
   * Checks if a given point is a starting or ending point of this segment.
   * @param point - A point to check against the segment's endpoints.
   * @returns `true` if the point is an endpoint of the segment, `false` otherwise.
   */
  includes(point: PointClass): boolean {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  /**
   *
   * @returns The length of the segment.
   */
  length(): number {
    return distance(this.p1, this.p2);
  }

  directionVector() {
    return normalize(substract(this.p2, this.p1));
  }

  distanceToPoint(point: PointClass | MathPoint) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }

    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }

  projectPoint(point: PointClass | MathPoint) {
    const a = substract(point, this.p1);
    const b = substract(this.p2, this.p1);
    const normB = normalize(b);
    const scaler = dot(a, normB);
    const proj = { point: add(this.p1, scale(normB, scaler)), offset: scaler / magnitude(b) };
    return proj;
  }

  /**
   * Renders the segment on a given canvas context.
   *
   * @param ctx - The canvas rendering context to draw the segment on.
   * @param options - (Optional) Options for drawing the segment, including width (2), color (black), and dash pattern ([]).
   */
  draw(ctx: CanvasRenderingContext2D, { color, lineWidth = 2, dash = [] }: SegmentDrawOptions = {}): void {
    ctx.beginPath();
    ctx.strokeStyle = color || "black";
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    if (this.p1 && this.p2) {
      ctx.moveTo(this.p1.x, this.p1.y);
      ctx.lineTo(this.p2.x, this.p2.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export default Segment;
