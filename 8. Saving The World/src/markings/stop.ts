import { MathPoint } from "../types/mathTypes";
import { PointClass, SegmentClass } from "../types/primitiveTypes";
import { translate, angle } from "../math/utils";
import Segment from "../primitives/segment";
import Envelope from "../primitives/envelope";
import Polygon from "../primitives/polygon";

class Stop {
  support: Segment;
  poly: Polygon;
  border: SegmentClass;
  type: string;

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

    this.border = this.poly.segments[2];
    this.type = "stop";
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.border.draw(ctx, { lineWidth: 10, color: "yellow" });

    this.poly.draw(ctx);
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle(this.directionVector) - Math.PI / 2);
    ctx.scale(1, 3);

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold " + this.height * 0.3 + "px Arial";
    ctx.fillText("STOP", 0, 1);

    ctx.restore();
  }
}

export default Stop;
