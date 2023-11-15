import type { PointClass } from "../types/primitiveTypes";
import type { SegmentClass } from "../types/primitiveTypes";
import Segment from "./segment";
import Point from "./point";
import { getIntersection, average, getRandomColor } from "../math/utils";

/**
 * Class representing a polygon shape.
 * HERE
 * HERE
 * HERE METHODS
 * HERE PROPS
 * METHODS
 * PROPS
 * ...
 */
class Polygon {
  /**
   * Array of points defining the vertices of the polygon.
   * @type {PointClass[]}
   */
  points: PointClass[];
  /**
   * Array of segments connecting the points of the polygon.
   * @type {SegmentClass[]}
   */
  segments: SegmentClass[];

  /**
   * Creates a Polygon instance.
   * @param {PointClass[]} points - Array of points to define the polygon vertices. Could theoretically be done with Mathpoints if some methods were independent of the Point class.
   */
  constructor(points: PointClass[]) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  /**
   * Draws the polygon on a canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {Object} [style] - Optional styling options for the polygon.
   * ! should also define type for the drawing options when the project nears its end
   */
  draw(ctx: CanvasRenderingContext2D, { stroke = "blue", linewidth = 2, fill = "rgba(0,0,255,0.3)" } = {}) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = linewidth; // Note: It should be `lineWidth`, not `linewidth`
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Static method to break two polygons at their intersections.
   * @param {Polygon} poly1 - First polygon.
   * @param {Polygon} poly2 - Second polygon.
   */
  static break(poly1: Polygon, poly2: Polygon) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const int = getIntersection(segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2);
        if (int && int.offset != 1 && int.offset != 0) {
          const point = new Point(int.x, int.y);
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  /**
   * Static method to break multiple polygons at their intersections.
   * @param {Polygon[]} polys - Array of polygons.
   */
  static multiBreak(polys: Polygon[]) {
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  /**
   * Static method to calculate the union of multiple polygons.
   * @param {Polygon[]} polys - Array of polygons.
   * @returns {SegmentClass[]} - Array of segments representing the union.
   */
  static union(polys: Polygon[]) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i != j) {
            if (polys[j].containsSegment(seg)) {
              keep = false;
              break;
            }
          }
        }
        if (keep) {
          keptSegments.push(seg);
        }
      }
    }
    return keptSegments;
  }

  /**
   * Checks if the polygon contains a given segment.
   * @param {SegmentClass} seg - The segment to check.
   * @returns {boolean} - True if the polygon contains the segment, otherwise false.
   */
  containsSegment(seg: SegmentClass) {
    const midpoint = average(seg.p1, seg.p2);
    return this.containsPoint(midpoint);
  }

  /**
   * Checks if the polygon contains a given point.
   * @param {PointClass | void} point - The point to check.
   * @returns {boolean} - True if the polygon contains the point, otherwise false.
   */
  containsPoint(point: PointClass | void) {
    if (!point) {
      return 0;
    }
    const outerPoint = new Point(-1000, -1000);
    let intersectionsCount = 0;
    for (const seg of this.segments) {
      const int = getIntersection(outerPoint, point, seg.p1, seg.p2);

      if (int) {
        intersectionsCount++;
      }
    }
    return intersectionsCount % 2 == 1;
  }

  /**
   * Draws all segments of the polygon with random colors.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawSegments(ctx: CanvasRenderingContext2D) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), lineWidth: 5 });
    }
  }
}

export default Polygon;
