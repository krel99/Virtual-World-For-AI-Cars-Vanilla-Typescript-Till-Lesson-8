import { PointClass, SegmentClass } from "./primitiveTypes";

/**
 * Represents a point in 2D space.
 *
 * @property {number} x - The horizontal coordinate.
 * @property {number} y - The vertical coordinate.
 */
export interface MathPoint {
  x: number;
  y: number;
}

// /**
//  * Defines the structure and operations of a Graph, which is composed of a collection of points and segments.
//  * Allows for adding and removing points and segments, checking for their existence, and drawing the graph.
//  *
//  * @property {PointClass[]} points - An array of point objects in the graph.
//  * @property {SegmentClass[]} segments - An array of segment objects in the graph.
//  * @method addPoint - Method to add a point to the graph.
//  * @method containsPoint - Method to check if a point exists in the graph.
//  * @method tryAddPoint - Method to try adding a point to the graph only if it doesn't already exist.
//  * @method removePoint - Method to remove a point from the graph.
//  * @method addSegment - Method to add a segment to the graph.
//  * @method containsSegment - Method to check if a segment exists in the graph.
//  * @method tryAddSegment - Method to try adding a segment to the graph only if it doesn't already exist.
//  * @method removeSegment - Method to remove a segment from the graph.
//  * @method getSegmentsWithPoint - Method to retrieve all segments that include a given point.
//  * @method dispose - Method to clear the graph of all points and segments.
//  * @method draw - Method to draw the graph on a canvas rendering context.
//  */
// export type GraphType = {
//   points: PointClass[];
//   segments: SegmentClass[];
//   addPoint(point: PointClass): void;
//   containsPoint(point: PointClass): boolean;
//   tryAddPoint(point: PointClass): boolean;
//   removePoint(point: PointClass): void;
//   addSegment(seg: SegmentClass): void;
//   containsSegment(seg: SegmentClass): boolean;
//   tryAddSegment(seg: SegmentClass): boolean;
//   removeSegment(seg: SegmentClass): void;
//   getSegmentsWithPoint(point: PointClass): SegmentClass[];
//   dispose(): void;
//   draw(ctx: CanvasRenderingContext2D): void;
//   load(info: any): GraphType;
// };
