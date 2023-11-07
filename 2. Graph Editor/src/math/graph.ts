import { GraphType } from "./mathTypes";
import { PointClass, SegmentClass } from "../primitives/primitiveTypes";

/**
 * Defines the structure and operations of a Graph, which is composed of a collection of points and segments.
 * Allows for adding and removing points and segments, checking for their existence, and drawing the graph.
 *
 * @implements {GraphType} Implements the GraphType interface for type safety and clarity.
 * @property {PointClass[]} points - An array of point objects in the graph.
 * @property {SegmentClass[]} segments - An array of segment objects in the graph.
 * @method addPoint - Method to add a point to the graph.
 * @method containsPoint - Method to check if a point exists in the graph.
 * @method tryAddPoint - Method to try adding a point to the graph only if it doesn't already exist.
 * @method removePoint - Method to remove a point from the graph.
 * @method addSegment - Method to add a segment to the graph.
 * @method containsSegment - Method to check if a segment exists in the graph.
 * @method tryAddSegment - Method to try adding a segment to the graph only if it doesn't already exist.
 * @method removeSegment - Method to remove a segment from the graph.
 * @method getSegmentsWithPoint - Method to retrieve all segments that include a given point.
 * @method dispose - Method to clear the graph of all points and segments.
 * @method draw - Method to draw the graph on a canvas rendering context.
 */
export class Graph implements GraphType {
  points: PointClass[];
  segments: SegmentClass[];

  constructor(points: PointClass[] = [], segments: SegmentClass[] = []) {
    this.points = points;
    this.segments = segments;
  }

  /**
   * Adds a new point to the graph.
   * @param {PointClass} point - The point to be added to the graph.
   */
  addPoint(point: PointClass): void {
    this.points.push(point);
  }

  /**
   * Checks if a point is present in the graph.
   * @param {PointClass} point - The point to check in the graph.
   * @returns {boolean} - True if the point is found, false otherwise.
   */
  containsPoint(point: PointClass): boolean {
    return this.points.find((p) => p.equals(point)) !== undefined;
  }

  /**
   * Attempts to add a point to the graph if it doesn't already exist.
   * @param {PointClass} point - The point to be added to the graph.
   * @returns {boolean} - True if the point was added, false if it was already present.
   */
  tryAddPoint(point: PointClass): boolean {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  /**
   * Removes a point from the graph.
   * @param {PointClass} point - The point to be removed from the graph.
   */
  removePoint(point: PointClass): void {
    const segs = this.getSegmentsWithPoint(point);
    segs.forEach((seg) => this.removeSegment(seg));
    this.points = this.points.filter((p) => !p.equals(point));
  }

  /**
   * Adds a new segment to the graph.
   * @param {SegmentClass} seg - The segment to be added to the graph.
   */
  addSegment(seg: SegmentClass): void {
    this.segments.push(seg);
  }

  /**
   * Checks if a segment is present in the graph.
   * @param {SegmentClass} seg - The segment to check in the graph.
   * @returns {boolean} - True if the segment is found, false otherwise.
   */
  containsSegment(seg: SegmentClass): boolean {
    return this.segments.find((s) => s.equals(seg)) !== undefined;
  }

  /**
   * Attempts to add a segment to the graph if it doesn't already exist and the segment's endpoints are not equal.
   * @param {SegmentClass} seg - The segment to be added to the graph.
   * @returns {boolean} - True if the segment was added, false if it was already present or invalid.
   */
  tryAddSegment(seg: SegmentClass): boolean {
    if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
      this.addSegment(seg);
      return true;
    }
    return false;
  }

  /**
   * Removes a segment from the graph.
   * @param {SegmentClass} seg - The segment to be removed from the graph.
   */
  removeSegment(seg: SegmentClass): void {
    this.segments = this.segments.filter((s) => !s.equals(seg));
  }

  /**
   * Retrieves all segments from the graph that include a given point.
   * @param {PointClass} point - The point for which to find segments.
   * @returns {SegmentClass[]} - An array of segments that include the given point.
   */
  getSegmentsWithPoint(point: PointClass): SegmentClass[] {
    return this.segments.filter((seg) => seg.includes(point));
  }

  /**
   * Clears the graph of all points and segments.
   */
  dispose(): void {
    this.points.length = 0;
    this.segments.length = 0;
  }

  /**
   * Draws the graph on a canvas, rendering all points and segments.
   * @param {CanvasRenderingContext2D} ctx - The canvas context on which the graph will be drawn.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    this.segments.forEach((seg) => seg.draw(ctx));
    this.points.forEach((point) => point.draw(ctx));
  }
}
