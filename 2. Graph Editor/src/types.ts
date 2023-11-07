import { GraphType } from "./math/mathTypes";
import { PointClass } from "./primitives/primitiveTypes";

/**
 * Represents the interactive editing capabilities for a graph on a canvas.
 *
 * @method addEventListeners - Attaches necessary event listeners to the canvas for graph interaction.
 * @method handleMouseMove - Handles mouse move events on the canvas, updating hovered and selected points.
 * @method handleMouseDown - Handles mouse down events on the canvas, potentially selecting or removing points or segments.
 * @method select - Marks a point as selected and prepares it for potential movement or segment connection.
 * @method removePoint - Removes a point from the graph, along with any associated segments.
 * @method display - Renders the current state of the graph on the canvas, including any interaction cues like the hovered or selected point.
 */
export interface GraphEditorType {
  canvas: HTMLCanvasElement;
  graph: GraphType;
  ctx: CanvasRenderingContext2D;
  selected: PointClass | null;
  hovered: PointClass | null;
  dragging: boolean;
  mouse: PointClass | null;
  display(): void;
}
