import { GraphEditorType } from "./types";
import { GraphType } from "./math/mathTypes";
import { PointClass } from "./primitives/primitiveTypes";
import Point from "./primitives/point";
import Segment from "./primitives/segment";
import { getNearestPoint } from "./math/utils";

export default class GraphEditor implements GraphEditorType {
  public canvas: HTMLCanvasElement;
  public graph: GraphType;
  public ctx: CanvasRenderingContext2D;
  public selected: PointClass | null = null;
  public hovered: PointClass | null = null;
  public dragging: boolean = false;
  public mouse: PointClass | null = null;

  constructor(canvas: HTMLCanvasElement, graph: GraphType) {
    this.canvas = canvas;
    this.graph = graph;
    this.ctx = canvas.getContext("2d")!;

    // ! can be done in a constructor in TS
    this.canvas.addEventListener("mousedown", (evt: MouseEvent) => this.handleMouseDown(evt));
    this.canvas.addEventListener("mousemove", (evt: MouseEvent) => this.handleMouseMove(evt));
    this.canvas.addEventListener("contextmenu", (evt: MouseEvent) => evt.preventDefault());
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
  }

  /**
   * Handles the mouse move event on the canvas.
   * Updates the mouse position and determines the nearest point to the cursor.
   * @param evt - The MouseEvent triggered by moving the mouse.
   */
  private handleMouseMove(evt: MouseEvent): void {
    this.mouse = new Point(evt.offsetX, evt.offsetY);
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
    if (this.dragging && this.selected) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  /**
   * Handles the mouse down event on the canvas.
   * Manages the selection and dragging state of points, as well as right-click removal.
   * @param evt - The MouseEvent triggered by pressing a mouse button.
   */
  private handleMouseDown(evt: MouseEvent): void {
    if (evt.button === 2) {
      // Right click
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.removePoint(this.hovered);
      }
    } else if (evt.button === 0) {
      // Left click
      if (this.hovered) {
        this.select(this.hovered);
        this.dragging = true;
      } else {
        const newPoint = new Point(evt.offsetX, evt.offsetY);
        this.graph.addPoint(newPoint);
        if (this.selected) {
          this.graph.tryAddSegment(new Segment(this.selected, newPoint));
        }
        this.selected = newPoint;
        this.hovered = newPoint;
      }
    }
  }

  /**
   * Selects a point as the current active or "selected" point.
   * May also try to add a segment if another point is already selected.
   * @param point - The PointClass object to select.
   */
  private select(point: PointClass): void {
    if (this.selected && !this.selected.equals(point)) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }

  /**
   * Removes a point from the graph and clears selection if necessary.
   * @param point - The PointClass object to remove.
   */
  private removePoint(point: PointClass): void {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  /**
   * Renders the graph, as well as any interaction cues like the hovered or selected point.
   */
  display(): void {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered ?? this.mouse;
      if (intent) {
        new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3], color: "grey" });
        this.selected.draw(this.ctx, { outline: true });
      }
    }
  }
}
