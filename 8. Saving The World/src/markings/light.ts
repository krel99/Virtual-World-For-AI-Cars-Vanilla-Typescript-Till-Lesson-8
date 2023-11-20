import { MathPoint } from "../types/mathTypes";
import { PointClass, SegmentClass } from "../types/primitiveTypes";
import { translate, angle, perpendicular, lerp2D, add, scale } from "../math/utils";
import Segment from "../primitives/segment";
import Envelope from "../primitives/envelope";
import Polygon from "../primitives/polygon";

class Light {
  support: Segment;
  poly: Polygon;
  border: SegmentClass;
  state: string;
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

    this.state = "off";
    this.border = this.poly.segments[0];

    this.type = "light";
  }

  draw(ctx: CanvasRenderingContext2D) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(add(this.center, scale(perp, this.width / 2)), add(this.center, scale(perp, -this.width / 2)));

    const green = lerp2D(line.p1, line.p2, 0.2);
    const yellow = lerp2D(line.p1, line.p2, 0.5);
    const red = lerp2D(line.p1, line.p2, 0.8);

    new Segment(red, green).draw(ctx, {
      lineWidth: this.height,
      // cap: "round",
    });

    green.draw(ctx, { size: this.height * 0.6, color: "#060" });
    yellow.draw(ctx, { size: this.height * 0.6, color: "#660" });
    red.draw(ctx, { size: this.height * 0.6, color: "#600" });

    switch (this.state) {
      case "green":
        green.draw(ctx, { size: this.height * 0.6, color: "#0F0" });
        break;
      case "yellow":
        yellow.draw(ctx, { size: this.height * 0.6, color: "#FF0" });
        break;
      case "red":
        red.draw(ctx, { size: this.height * 0.6, color: "#F00" });
        break;
    }
  }
}

export default Light;
