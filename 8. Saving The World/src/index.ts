import World from "./world.ts";
import GraphEditor from "./editors/graphEditor.ts";
import StopEditor from "./editors/stopEditor.ts";
import CrossingEditor from "./editors/crossingEditor.ts";
import Graph from "./math/graph";
import { Viewport } from "./viewport";
import { scale } from "./math/utils";
import LightEditor from "./editors/lightEditor";
import TargetEditor from "./editors/targetEditor";
import ParkingEditor from "./editors/parkingEditor";
import StartEditor from "./editors/startEditor";
import YieldEditor from "./editors/yieldEditor";

// TODO Randomize building and tree heights
// TODO Style buildings
// TODO World type
// TODO Array.concat instead of spread operators would be more performant in some places (World Class, f.e.)

const disposeButton = document.getElementById("disposeButton")!;
const saveButton = document.getElementById("saveButton")!;
const editorButton = document.getElementById("graphBtn")!;
const stopBtn = document.getElementById("stopBtn")!;
const crossingBtn = document.getElementById("crossingBtn")!;
const lightButton = document.getElementById("lightBtn")!;
const targetButton = document.getElementById("targetBtn")!;
const parkingButton = document.getElementById("parkingBtn")!;
const startButton = document.getElementById("startBtn")!;
const yieldButton = document.getElementById("yieldBtn")!;

const loadButton = document.getElementById("fileInput")!;

disposeButton.addEventListener("click", dispose);
saveButton.addEventListener("click", save);
editorButton.addEventListener("click", () => setMode("graph"));
stopBtn.addEventListener("click", () => setMode("road"));
crossingBtn.addEventListener("click", () => setMode("crossing"));
lightButton.addEventListener("click", () => setMode("light"));
targetButton.addEventListener("click", () => setMode("target"));
parkingButton.addEventListener("click", () => setMode("parking"));
startButton.addEventListener("click", () => setMode("start"));
yieldButton.addEventListener("click", () => setMode("yield"));
loadButton.addEventListener("change", load);

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

const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldInfo ? World.load(worldInfo) : new World(new Graph());

const graph = world.graph;

const viewport = new Viewport(myCanvas, ctx, world.zoom, world.offset);
const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);
const crossingEditor = new CrossingEditor(viewport, world);
const lightEditor = new LightEditor(viewport, world);
const targetEditor = new TargetEditor(viewport, world);
const parkingEditor = new ParkingEditor(viewport, world);
const startEditor = new StartEditor(viewport, world);
const yieldEditor = new YieldEditor(viewport, world);

let oldGraphHash = graph.hash();

setMode("graph");

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
  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(ctx, viewPoint);
  ctx.globalAlpha = 0.3;
  graphEditor.display();
  stopEditor.display();
  crossingEditor.display();
  lightEditor.display();
  targetEditor.display();
  parkingEditor.display();
  startEditor.display();
  yieldEditor.display();
  requestAnimationFrame(animate);
}

/**
 * ! Deletes the graph but does not dispose of the local Storage
 */
function dispose(): void {
  graphEditor.dispose();
  world.markings.length = 0;
}

/**
 * Saves data to the local storage
 */
function save(): void {
  world.zoom = viewport.zoom;
  world.offset = viewport.offset;

  const element = document.createElement("a");

  element.setAttribute("href", "data:application/json; charset=utf-8," + encodeURIComponent(JSON.stringify(world)));
  localStorage.setItem("world", JSON.stringify(world));

  const fileName = "name.world";
  element.setAttribute("download", fileName);
  element.click();
}

function load(event: any) {
  const file = event.target.files[0];

  if (!file) {
    alert("No file selected");
    return;
  }
  const reader = new FileReader();

  reader.readAsText(file);
  reader.onload = (evt: any) => {
    const fileContent = evt.target.result;
    const jsonData = JSON.parse(fileContent);
    world = World.load(jsonData);
    localStorage.setItem("world", JSON.stringify(world));
    location.reload();
  };
}

function setMode(mode: string) {
  disableEditors();

  switch (mode) {
    case "graph":
      editorButton.style.backgroundColor = "white";
      editorButton.style.filter = "";
      graphEditor.enable();
      break;
    case "road":
      stopBtn.style.backgroundColor = "white";
      stopBtn.style.filter = "";
      stopEditor.enable();
      break;
    case "crossing":
      crossingBtn.style.backgroundColor = "white";
      crossingBtn.style.filter = "";
      crossingEditor.enable();
      break;
    case "light":
      lightButton.style.backgroundColor = "white";
      lightButton.style.filter = "";
      lightEditor.enable();
      break;
    case "target":
      targetButton.style.backgroundColor = "white";
      targetButton.style.filter = "";
      targetEditor.enable();
      break;
    case "parking":
      parkingButton.style.backgroundColor = "white";
      parkingButton.style.filter = "";
      parkingEditor.enable();
      break;
    case "start":
      startButton.style.backgroundColor = "white";
      startButton.style.filter = "";
      startEditor.enable();
      break;
    case "yield":
      yieldButton.style.backgroundColor = "white";
      yieldButton.style.filter = "";
      yieldEditor.enable();
      break;
  }
}

function disableEditors() {
  editorButton.style.backgroundColor = "gray";
  editorButton.style.filter = "grayscale(100%)";
  graphEditor.disable();

  stopBtn.style.backgroundColor = "gray";
  stopBtn.style.filter = "grayscale(100%)";
  stopEditor.disable();

  crossingBtn.style.backgroundColor = "gray";
  crossingBtn.style.filter = "grayscale(100%)";
  crossingEditor.disable();

  lightButton.style.backgroundColor = "gray";
  lightButton.style.filter = "grayscale(100%)";
  lightEditor.disable();

  targetButton.style.backgroundColor = "gray";
  targetButton.style.filter = "grayscale(100%)";
  targetEditor.disable();

  parkingButton.style.backgroundColor = "gray";
  parkingButton.style.filter = "grayscale(100%)";
  parkingEditor.disable();

  startButton.style.backgroundColor = "gray";
  startButton.style.filter = "grayscale(100%)";
  startEditor.disable();

  yieldButton.style.backgroundColor = "gray";
  yieldButton.style.filter = "grayscale(100%)";
  yieldEditor.disable();
}
