import type { MathPoint } from "../math/mathTypes.ts";

/**
 * Represents common drawing options for elements in 2D space.
 *
 * @property {string} [color] - The color used for drawing.
 */
interface DrawOptions {
  color?: string;
}

/**
 * Represents drawing options for a point in 2D space.
 *
 * @property {number} [size] - The size of the point when drawn.
 * @property {boolean} [outline] - Determines if the point should have an outline.
 * @property {boolean} [fill] - Determines if the point should be filled.
 */
export interface PointDrawOptions extends DrawOptions {
  size?: number;
  outline?: boolean;
  fill?: boolean;
}

/**
 * Represents drawing options for a segment in 2D space.
 *
 * @property {number} [width] - The width of the line of the segment.
 * @property {number[]} [dash] - The dash pattern for the line of the segment.
 */
export interface SegmentDrawOptions extends DrawOptions {
  width?: number;
  dash?: number[];
}

/**
 * Defines the functionality for a point class in 2D space.
 *
 * @method equals - Determines if another point is equal to this one.
 * @method draw - Draws this point on a canvas context.
 */
export interface PointClass extends MathPoint {
  equals(other: MathPoint): boolean;
  draw(ctx: CanvasRenderingContext2D, options?: PointDrawOptions): void;
}

/**
 * Defines the functionality for a segment in 2D space, which is a part of a line between two points.
 *
 * @property {MathPoint} p1 - The starting point of the segment.
 * @property {MathPoint} p2 - The ending point of the segment.
 * @method equals - Determines if another segment is equal to this one.
 * @method includes - Checks if a given point is a starting or ending point of this segment.
 * @method draw - Draws this segment on a canvas context.
 */
export interface SegmentClass {
  p1: PointClass;
  p2: PointClass;
  equals(seg: SegmentClass): boolean;
  includes(point: PointClass): boolean;
  draw(ctx: CanvasRenderingContext2D, options?: SegmentDrawOptions): void;
}
