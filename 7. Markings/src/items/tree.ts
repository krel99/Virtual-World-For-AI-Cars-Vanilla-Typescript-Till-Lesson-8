import { PointClass } from "../types/primitiveTypes";
import { MathPoint } from "../types/mathTypes";
import { add, substract, scale, lerp, lerp2D, translate } from "../math/utils";
import Polygon from "../primitives/polygon";
// import Segment from "../primitives/segment";

class Tree {
  center: PointClass;
  size: number;
  heightCoefficient: number;
  base: Polygon;

  constructor(center: PointClass, size: number, heightCoefficient: number = 0.3) {
    this.center = center;
    this.size = size; // base of the tree
    this.heightCoefficient = heightCoefficient;
    this.base = this.generateLevel(center, size);
  }

  private generateLevel(point: PointClass | MathPoint, size: number): Polygon {
    const points = [];
    const rad = size / 2;
    // * can draw them right away for better overlaps
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 16) {
      const kindOfRandom = Math.cos(((i + this.center.x) * size) % 17) ** 2;
      //   const noisyRadius = rad * lerp(0.5, 1, Math.random() * 0.2 + kindOfRandom * 0.75);
      const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);
      points.push(translate(point, i, noisyRadius));
    }
    return new Polygon(points);
  }

  draw(ctx: CanvasRenderingContext2D, viewPoint: PointClass) {
    const diff = substract(this.center, viewPoint);

    // this.center.draw(ctx, { size: this.size, color: "green" });

    const top = add(this.center, scale(diff, this.heightCoefficient));

    const levelCount = 7;

    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = lerp2D(this.center, top, t);
      const color = "rgb(30," + lerp(50, 200, t) + ",70)";
      const size = lerp(this.size, 40, t);
      // point.draw(ctx, { size: size, color: color });
      const poly = this.generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
    }
    // this.base.draw(ctx);

    // new Segment(this.center, top).draw(ctx);
  }
}
export default Tree;
