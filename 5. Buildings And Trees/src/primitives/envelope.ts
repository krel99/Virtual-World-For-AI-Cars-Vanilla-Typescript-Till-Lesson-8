import Polygon from "./polygon";
import { angle, substract, translate } from "../math/utils";
import type { SegmentDrawOptions } from "../types/primitiveTypes";
import type { SegmentClass } from "../types/primitiveTypes";

/**
 * Class representing an 'Envelope' around the road (gray-filled area with white borders).
 *
 * @class Envelope
 * @property {SegmentClass} skeleton - Base segment for the envelope.
 * @property {Polygon} poly - Polygon representing the envelope's shape.
 */
class Envelope {
  /**
   * The base segment from which the envelope shape is derived.
   * @type {SegmentClass}
   */
  skeleton: SegmentClass;
  /**
   * The polygon representation of the envelope.
   * @type {Polygon}
   */
  poly: Polygon;

  /**
   * Constructs an `Envelope` object.
   *
   * @param {SegmentClass} skeleton - The base segment for the envelope shape.
   * @param {number} width - The width of the envelope, affecting its size.
   * @param {number} [roundness=3] - The roundness of the envelope corners, defaults to 3.
   */
  constructor(skeleton: SegmentClass, width: number, roundness: number = 3) {
    this.skeleton = skeleton;
    this.poly = this.generatePolygon(width, roundness);
  }

  /**
   * Generates a polygon based on the skeleton segment, width, and roundness.
   * This method is private and used internally in the constructor.
   *
   * @param {number} width - The width of the envelope.
   * @param {number} [roundness=3] - The roundness of the envelope corners.
   * @returns {Polygon} - The constructed polygon.
   * @private
   */
  private generatePolygon(width: number, roundness: number = 3): any {
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;
    const alpha = angle(substract(p1, p2));
    const alpha_cw = alpha + Math.PI / 2; //clockwise
    const alpha_ccw = alpha - Math.PI / 2; //counterclockwise
    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const eps = step / 2; // to kill artifacts
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    const retPolygon = new Polygon(points);
    return retPolygon;
  }

  /**
   * Draws the envelope on a canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   * @param {SegmentDrawOptions} options - Drawing options.
   */
  draw(ctx: CanvasRenderingContext2D, options: SegmentDrawOptions): void {
    this.poly.draw(ctx, options);
  }
}

export default Envelope;
