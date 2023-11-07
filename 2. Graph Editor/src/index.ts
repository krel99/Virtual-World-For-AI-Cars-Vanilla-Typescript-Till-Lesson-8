import Point from "./primitives/point";
import Segment from "./primitives/segment";
import { Graph } from "./math/graph";

import GraphEditor from "./graphEditor";

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
myCanvas.width = 600;
myCanvas.height = 600;

const ctx = myCanvas.getContext("2d")!;

const p1 = new Point(100, 100);
const p2 = new Point(200, 200);
const p3 = new Point(200, 300);
const p4 = new Point(300, 300);

ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
const rad = 10 / 2;
ctx.beginPath();
ctx.fillStyle = "black";
ctx.arc(100, 200, rad, 0, 2 * Math.PI);
ctx.fill();

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p3, p4);
const s4 = new Segment(p2, p4);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);

const graphEditor = new GraphEditor(myCanvas, graph);

animate();

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graphEditor.display();
  requestAnimationFrame(animate);
}
