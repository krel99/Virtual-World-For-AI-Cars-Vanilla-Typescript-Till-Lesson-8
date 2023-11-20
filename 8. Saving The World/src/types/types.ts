import { PointClass } from "./primitiveTypes";
import Point from "../primitives/point";
import Graph from "../math/graph";

/**
 * Represents the interactive editing capabilities for a graph on a canvas.
 */
export interface GraphEditorType {
  viewport: viewPort;
  canvas: HTMLCanvasElement;
  graph: Graph;
  ctx: CanvasRenderingContext2D;
  selected: PointClass | null;
  hovered: PointClass | null;
  dragging: boolean;
  mouse: PointClass | null;
  display(): void;
  dispose(): void;
}

/**
 * Controls viewport
 */
export interface viewPort {
  zoom: number;
  canvas: HTMLCanvasElement;
  getMouse(evt: MouseEvent, substractDragOffset: boolean): Point;
  offset: PointClass; // MathPoint?
  drag: Object; // of points?
}
