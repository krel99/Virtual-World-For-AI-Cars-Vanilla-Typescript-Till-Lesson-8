import Envelope from "./primitives/envelope";
import type { GraphType } from "./types/mathTypes";
import Polygon from "./primitives/polygon";
import { PointClass, SegmentClass } from "./types/primitiveTypes";

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
   * Constructor to create a World instance.
   * @param {GraphType} graph - The graph structure of the world.
   * @param {number} [roadWidth=100] - The default width of the roads.
   * @param {number} [roadRoundness=3] - The default roundness of the roads.
   */
  constructor(graph: GraphType, roadWidth: number = 100, roadRoundness: number = 3) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    this.envelopes = [];
    this.roadBorders = [];

    this.generate();
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
  }

  /**
   * Draws the world on a canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
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
  }
}

export default World;
