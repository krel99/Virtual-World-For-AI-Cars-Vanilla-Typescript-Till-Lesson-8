import { PointClass, SegmentClass } from "../types/primitiveTypes";
import { translate, angle } from "../math/utils";
import Segment from "../primitives/segment";
import Envelope from "../primitives/envelope";
import Polygon from "../primitives/polygon";

class Target {
  support: Segment;
  poly: Polygon;
  border: SegmentClass;
  type: string;

  constructor(public center: PointClass, public directionVector: PointClass, public width: number, public height: number) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;
    this.support = new Segment(
      translate(center, angle(directionVector), height / 2),
      translate(center, angle(directionVector), -height / 2)
    );

    this.poly = new Envelope(this.support, width, 0).poly;

    this.border = this.poly.segments[2];
    this.type = "target";
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.center.draw(ctx, { color: "red", size: 30 });
    this.center.draw(ctx, { color: "white", size: 20 });
    this.center.draw(ctx, { color: "red", size: 10 });
  }
}

export default Target;
