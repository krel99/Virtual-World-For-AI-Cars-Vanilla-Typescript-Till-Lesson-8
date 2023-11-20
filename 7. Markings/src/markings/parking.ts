import { MathPoint } from "../types/mathTypes";
import { PointClass, SegmentClass } from "../types/primitiveTypes";
import { translate, angle } from "../math/utils";
import Segment from "../primitives/segment";
import Envelope from "../primitives/envelope";
import Polygon from "../primitives/polygon";

class Parking {
  support: Segment;
  poly: Polygon;
  borders: SegmentClass[];

  constructor(public center: PointClass | MathPoint, public directionVector: PointClass, public width: number, public height: number) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;
    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );

    this.poly = new Envelope(this.support, width, 0).poly;

    this.borders = [this.poly.segments[0], this.poly.segments[2]];
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const border of this.borders) {
      border.draw(ctx, { lineWidth: 5, color: "white" });
    }
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector));

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold " + this.height * 0.9 + "px Arial";
    ctx.fillText("P", 0, 3);

    ctx.restore();
  }
}

export default Parking;
