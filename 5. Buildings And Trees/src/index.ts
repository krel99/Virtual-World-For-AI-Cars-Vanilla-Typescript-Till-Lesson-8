// import Point from "./primitives/point";
// import Segment from "./primitives/segment";
import { Graph } from "./math/graph";
import GraphEditor from "./graphEditor";
import { Viewport } from "./viewport";
// import Polygon from "./primitives/polygon";
// import Envelope from "./primitives/envelope.ts";
import World from "./world.ts";

const disposeButton = document.getElementById("disposeButton")!;
const saveButton = document.getElementById("saveButton")!;

disposeButton.addEventListener("click", dispose);
saveButton.addEventListener("click", save);

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight * 0.8;

const ctx = myCanvas.getContext("2d")!;

ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
const rad = 10 / 2;
ctx.beginPath();
ctx.fillStyle = "black";
ctx.arc(100, 200, rad, 0, 2 * Math.PI);
ctx.fill();

const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();
const world = new World(graph);
const viewport = new Viewport(myCanvas, ctx);
const graphEditor = new GraphEditor(viewport, graph);

let oldGraphHash = graph.hash();

animate();

/**
 * Takes care of, well, animating the canvas.
 */
function animate(): void {
  viewport.reset();
  if (graph.hash() !== oldGraphHash) {
    world.generate();
    oldGraphHash = graph.hash();
  }
  world.draw(ctx);
  ctx.globalAlpha = 0.3;
  graphEditor.display();
  requestAnimationFrame(animate);
}

/**
 * ! Deletes the graph but does not dispose of the local Storage
 */
function dispose(): void {
  graphEditor.dispose();
}

/**
 * Saves data to the local storage
 */
function save(): void {
  localStorage.setItem("graph", JSON.stringify(graph));
}
