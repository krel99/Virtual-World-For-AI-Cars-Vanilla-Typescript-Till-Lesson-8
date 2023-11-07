import type { MathPoint } from "./mathTypes";
import type { PointClass } from "../primitives/primitiveTypes";

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
