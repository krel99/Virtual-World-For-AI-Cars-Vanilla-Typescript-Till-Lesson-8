import Envelope from "./primitives/envelope";
import Polygon from "./primitives/polygon";
import Segment from "./primitives/segment";
import Point from "./primitives/point";
import type { GraphType } from "./types/mathTypes";
import { PointClass, SegmentClass } from "./types/primitiveTypes";
import { add, scale, distance, lerp } from "./math/utils";
import Tree from "./items/tree";
import Building from "./items/building";

class World {
  /**
   * A graph structure representing the layout of the world.
   * @type {GraphType}
   */
  graph: GraphType;
  /**
   * The width of the roads in the world.
   * @type {number}
   */
  roadWidth: number;
  /**
   * The roundness of the roads in the world.
   * @type {number}
   */
  roadRoundness: number;
  /**
   * An array of Envelope objects representing areas around the road segments.
   * @type {Envelope[]}
   */
  envelopes: Envelope[];
  /**
   * An array of SegmentClass objects representing the borders of the road.
   * It can be undefined if not initialized.
   * @type {SegmentClass[] | undefined}
   */
  roadBorders: SegmentClass[] | undefined; // ! not sure if undefined is needed here
  /**
   * Represents intersections in the world.
   * It can be undefined if not initialized.
   * @type {PointClass | undefined}
   */
  intersections: PointClass | undefined;
  /**
   * The width of the buildings in the world.
   * @type {number}
   */
  buildingWidth: number;
  /**
   * The minimum length of the buildings in the world.
   * @type {number}
   */
  buildingMinLength: number;
  /**
   * The spacing between buildings and trees in the world.
   * @type {number}
   */
  spacing: number;
  /**
   *
   */
  treeSize: number;
  /**
   *
   */
  buildings: any[]; // ! not sure what type this should be as of now
  /**
   *
   */
  trees: any[]; // ! not sure what type this should be as of now

  /**
   * Constructor to create a World instance.
   * @param {GraphType} graph - The graph structure of the world.
   * @param {number} [roadWidth=100] - The default width of the roads.
   * @param {number} [roadRoundness=3] - The default roundness of the roads.
   */
  constructor(
    graph: GraphType,
    roadWidth: number = 100,
    roadRoundness: number = 10,
    buildingWidth: number = 150,
    buildingMinLength = 150,
    spacing = 50
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = 200;
    this.envelopes = [];
    this.roadBorders = [];
    this.buildings = [];
    this.trees = [];

    this.generate();
  }
  // ! the problem is that with lower number it may be impossible to place all of the tries and this will never end
  private generateTrees(count: number = 120): Tree[] {
    if (!this.roadBorders) {
      return [];
    }

    const points = [...this.roadBorders.map((s) => [s.p1, s.p2]).flat(), ...this.buildings.map((b) => b.base.points).flat()];

    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illegalPolys = [...this.buildings.map((b) => b.base), ...this.envelopes.map((e) => e.poly)];

    const trees = [];
    let tryCount = 0;
    while (trees.length < count && tryCount < 100) {
      const p = new Point(lerp(left, right, Math.random()), lerp(top, bottom, Math.random()));

      let keep = true;

      //intersections with roads
      for (const poly of illegalPolys) {
        if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
          keep = false;
          break;
        }
      }

      //intersections with other trees
      // ! optional
      if (keep) {
        for (const tree of trees) {
          if (distance(tree.center, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }

      //preventing generation of trees too far away from the roads
      if (keep) {
        let closeToSomething = false;
        for (const poly of illegalPolys) {
          if (poly.distanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      if (keep) {
        trees.push(new Tree(p, this.treeSize));
        tryCount = 0;
      }
      tryCount++;
    }
    return trees;
  }
  //!any
  private generateBuildings(): any {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(new Envelope(seg, this.roadWidth + this.buildingWidth + this.spacing * 2, this.roadRoundness));
    }

    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];

      if (seg.length() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    const supports = [];
    for (let seg of guides) {
      const len = seg.length() + this.spacing;
      const buildingCount = Math.floor(len / (this.buildingMinLength + this.spacing));
      const buildingLength = len / buildingCount - this.spacing;
      const dir = seg.directionVector();

      let q1 = seg.p1;
      let q2 = add(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      for (let i = 2; i <= buildingCount; i++) {
        q1 = add(q2, scale(dir, this.spacing));
        q2 = add(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    const bases = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    const eps = 0.001;
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        // second condition prevents buildings on different segments spawning on top
        if (bases[i].intersectsPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps) {
          bases.splice(j, 1);
          j--;
        }
      }
    }
    //!addasdasdsadsa
    return bases.map((b) => new Building(b));
  }

  /**
   * Generates the envelopes and road borders based on the graph segments.
   */
  generate(): void {
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(new Envelope(seg, this.roadWidth, this.roadRoundness));
    }
    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    this.buildings = this.generateBuildings();
    this.trees = this.generateTrees();
  }

  /**
   * Draws the world on a canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D, viewPoint: PointClass): void {
    for (const env of this.envelopes) {
      env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "white", lineWidth: 4, dash: [10, 10] });
    }
    if (this.roadBorders) {
      for (const seg of this.roadBorders) {
        seg.draw(ctx, { color: "red", lineWidth: 2 });
      }
    }

    const items = [...this.trees, ...this.buildings];
    // * This prevents objects being on top of one another
    items.sort((a, b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint));

    for (const item of items) {
      item.draw(ctx, viewPoint);
    }
    // for (const bld of this.buildings) {
    //   bld.draw(ctx, viewPoint);
    // }
  }
}

export default World;
