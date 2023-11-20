import Crossing from "./crossing";
import Light from "./light";
import Target from "./target";
import Parking from "./parking";
import Start from "./start";
import Yield from "./yield";
import Stop from "./stop";
import Point from "../primitives/point";

export default function (marking: any) {
  switch (marking.type) {
    case "target":
      return new Target(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "parking":
      return new Parking(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "crossing":
      return new Crossing(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "light":
      return new Light(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "start":
      return new Start(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "yield":
      return new Yield(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    case "stop":
      return new Stop(
        new Point(marking.center.x, marking.center.y),
        new Point(marking.directionVector.x, marking.directionVector.y),
        marking.width,
        marking.height
      );
    default:
  }
}
