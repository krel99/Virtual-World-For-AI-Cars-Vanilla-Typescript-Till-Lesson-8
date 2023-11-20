import { viewPort } from "../types/types";
import { getNearestSegment } from "../math/utils";
import Crossing from "../markings/crossing";

// ! World Class has no type for now, using any for now!
// ! no types in road Rules editor either

class crossingEditor {
  public viewport: viewPort;
  public world: any;
  public canvas: HTMLCanvasElement; // CanvasRenderingContext2D
  public ctx: CanvasRenderingContext2D;
  public selected: any | null = null;
  public hovered: any | null = null;
  public dragging: boolean = false;
  public mouse: any | null = null;
  public intent: any | null = null;
  public boundMouseDown: (evt: MouseEvent) => void;
  public boundMouseMove: (evt: MouseEvent) => void;
  public boundContextMenu: (evt: MouseEvent) => void;
  public markings: any[] = [];

  // ! any for now, same issue with viewport/viewPort as with graphEditor

  constructor(viewport: viewPort | any, world: any) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d")!;

    this.mouse = null;
    this.intent = null;
    this.markings = world.markings;

    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundContextMenu = (evt: MouseEvent) => evt.preventDefault();
  }

  enable() {
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundContextMenu = (evt: MouseEvent) => evt.preventDefault();

    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  disable() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    // Mr. Istodor uses false, but I have defined selected and hovered as either Null | PointClass!
    this.selected = null;
    this.hovered = null;
  }

  private handleMouseDown(evt: MouseEvent): void {
    if (evt.button === 0) {
      if (this.intent) {
        this.markings.push(this.intent);
        this.intent = null;
      }
    }
    if (evt.button === 2) {
      const indexToRemove = this.markings.findIndex((mark) => mark.poly.containsPoint(this.mouse));
      if (indexToRemove !== -1) {
        this.markings.splice(indexToRemove, 1);
      }
    }
  }

  // * This is Mr. Istodor's version rewritten with for
  // private handleMouseDown(evt: MouseEvent): void {
  //   if (evt.button === 0) {
  //     if (this.intent) {
  //       this.markings.push(this.intent);
  //       this.intent = null;
  //     }
  //   }
  //   if (evt.button === 2) {
  //     for (let i = 0; i < this.markings.length; i++) {
  //       const poly = this.markings[i].poly;
  //       if (poly.containsPoint(this.mouse)) {
  //         this.markings.splice(i, 1);
  //         return;
  //       }
  //     }
  //   }
  // }

  private handleMouseMove(evt: MouseEvent): void {
    this.mouse = this.viewport.getMouse(evt, true);
    const seg = getNearestSegment(this.mouse, this.world.graph.segments, 10 * this.viewport.zoom);
    if (seg) {
      const proj = seg.projectPoint(this.mouse);
      if (proj.offset >= 0 && proj.offset <= 1) {
        this.intent = new Crossing(proj.point, seg.directionVector(), this.world.roadWidth, this.world.roadWidth / 2);
      }
    } else {
      this.intent = null;
    }
  }

  display(): void {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}

export default crossingEditor;
