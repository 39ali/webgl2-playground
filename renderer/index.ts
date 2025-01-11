import { Renderer } from "./renderer";

import { OrthoCamera } from "./ortho_camera";
import { CameraController } from "./camera_controller";
import { Rectangle } from "./elements/rectangle";
import { FillType, StrokePos } from "./elements/shape";
import { Triangle } from "./elements/triangle";

export function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new Renderer(canvas);
  const elements = demo();

  const cam = new OrthoCamera(1024, 1024);
  const _ = new CameraController(canvas, cam);
  renderer.add_elements(elements);

  const render = () => {
    renderer.render(cam);
    requestAnimationFrame(render);
  };

  render();
}

function demo() {
  const dataArray = [];
  {
    const newShape = new Rectangle();
    newShape.setDimension({
      x: -100,
      y: 100,
      width: 200,
      height: 400,
    });
    newShape.addFill({
      type: FillType.SOLID,
      color: [0.3, 0.3, 0.3, 1.0],
    });
    newShape.addStroke({
      type: FillType.SOLID,
      color: [0.3, 0.7, 0.3, 1.0],
    });
    newShape.setStrokePosition(StrokePos.CENTER);
    newShape.setStrokeWidth(10);

    newShape.setRadius(10);
    dataArray.push(newShape);
  }
  {
    const newShape = new Triangle();
    newShape.setDimension({
      x: -200,
      y: 100,
      width: 100,
      height: 200,
    });
    newShape.addFill({
      type: FillType.SOLID,
      color: [0.9, 0.3, 0.3, 1],
    });
    newShape.addStroke({
      type: FillType.SOLID,
      color: [0.0, 0.3, 1.0, 1.0],
    });
    newShape.setStrokePosition(StrokePos.INSIDE);
    newShape.setStrokeWidth(10);

    dataArray.push(newShape);
  }
  return dataArray;
}
