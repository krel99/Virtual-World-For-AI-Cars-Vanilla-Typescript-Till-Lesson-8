import type { MathPoint } from "../types/mathTypes";
import type { PointClass } from "../types/primitiveTypes";
import Point from "../primitives/point";

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @type {(p1: MathPoint, p2: MathPoint) => number}
 */
export function distance(p1: MathPoint, p2: MathPoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Finds the nearest point to a given location within a threshold.
 *
 * @type {(loc: MathPoint, points: MathPoint[], threshold?: number) => MathPoint | null}
 */
export function getNearestPoint(loc: MathPoint, points: PointClass[], threshold: number = Number.MAX_SAFE_INTEGER): PointClass | null {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearest: PointClass | null = null;
  for (const point of points) {
    const dist = distance(loc, point);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  }
  return nearest;
}

/**
 * Adds the coordinates of two PointClass instances and returns a new PointClass instance with the result.
 * @param p1 - The first point operand.
 * @param p2 - The second point operand.
 * @returns {PointClass} A new PointClass instance with coordinates being the sum of `p1` and `p2`.
 */
export function add(p1: PointClass | MathPoint, p2: PointClass | MathPoint): PointClass {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

/**
 * Subtracts the coordinates of the second PointClass instance from the first and returns a new PointClass instance with the result.
 * @param p1 - The point from which to subtract.
 * @param p2 - The point to subtract.
 * @returns {PointClass} A new PointClass instance with coordinates being the difference of `p1` and `p2`.
 */
export function substract(p1: PointClass, p2: PointClass): PointClass {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Scales the coordinates of a PointClass instance by a scaler and returns a new PointClass instance with the result.
 * @param p - The point to scale.
 * @param scaler - The number by which to scale the point's coordinates.
 * @returns {PointClass} A new PointClass instance with coordinates being the product of `p` and `scaler`.
 */
export function scale(p: PointClass, scaler: number): PointClass {
  return new Point(p.x * scaler, p.y * scaler);
}

/**
 * Translates a point by a given angle and offset.
 *
 * @param loc - The location of original point to be translated.
 * @param angle - The angle in radians for translation direction.
 * @param offset - The distance to move the point along the given angle.
 * @returns The new point after translation.
 */
export function translate(loc: PointClass | MathPoint, angle: number, offset: number) {
  return new Point(loc.x + Math.cos(angle) * offset, loc.y + Math.sin(angle) * offset);
}

/**
 * Calculates the angle in radians from the origin to a point.
 *
 * @param p - The point for which to calculate the angle.
 * @returns The angle in radians from the origin to point `p`.
 */
export function angle(p: PointClass) {
  return Math.atan2(p.y, p.x);
}

/**
 * Calculates the intersection point, if any, between two line segments defined by points A, B and C, D.
 *
 * @param A - The start point of the first line segment, or `undefined` if not defined.
 * @param B - The end point of the first line segment, or `undefined` if not defined.
 * @param C - The start point of the second line segment, or `undefined` if not defined.
 * @param D - The end point of the second line segment, or `undefined` if not defined.
 * @returns An object containing the `x` and `y` coordinates of the intersection point and the `offset` from point A,
 *          if an intersection exists and all points are defined. Returns `null` if there's no intersection or if any point is `undefined`.
 */
export function getIntersection(A: PointClass, B: PointClass, C: PointClass, D: PointClass) {
  // console.log(A, B, C, D);
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // * to fix the bug due to floating points in JS calculations
  const eps = 0.001;
  if (Math.abs(bottom) >= eps) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

/**
 * Performs linear interpolation between two values.
 *
 * @param start - The start value.
 * @param end - The end value.
 * @param t - The interpolation parameter, typically between 0 and 1.
 * @returns The interpolated value between `start` and `end` at the point specified by `t`.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Calculates the average (midpoint) of two points.
 *
 * @param p1 - The first point.
 * @param p2 - The second point.
 * @returns The midpoint between `p1` and `p2` as a new `PointClass` object, or `void` if either point is undefined or null.
 */
export function average(p1: PointClass, p2: PointClass): PointClass | void {
  if (p1 && p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }
}

/**
 * Generates a random color in HSL format.
 *
 * @returns {string} A string representing a color in HSL format.
 *
 * @description
 * This function calculates a random hue value and returns an HSL color string
 * with full saturation (100%) and lightness set to 60%. The hue is calculated
 * by starting at 290 degrees and adding a random value between 0 and 260 degrees.
 * This means the hue can range from 290 to 550 degrees. However, since HSL hue values
 * wrap around at 360 degrees, hues greater than 360 are effectively subtracted by 360.
 *
 * Example output: "hsl(312, 100%, 60%)"
 */
export function getRandomColor(): string {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}

export function normalize(p: PointClass) {
  return scale(p, 1 / magnitude(p));
}

export function magnitude(p: PointClass) {
  return Math.hypot(p.x, p.y);
}

export function dot(p1: PointClass, p2: PointClass) {
  return p1.x * p2.x + p1.y * p2.y;
}

export function lerp2D(A: MathPoint | PointClass, B: MathPoint | PointClass, t: number): PointClass {
  return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}
