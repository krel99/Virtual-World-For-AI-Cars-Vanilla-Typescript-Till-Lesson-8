import type { MathPoint } from "./mathTypes";
import type { PointClass } from "../primitives/primitiveTypes";
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
export function add(p1: PointClass, p2: PointClass): PointClass {
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
