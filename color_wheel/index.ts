import { OrthoCamera } from "../renderer/ortho_camera";
import { CameraController } from "../renderer/camera_controller";
import { Rect } from "./rect/rect";
import { RectMaterial } from "./rect/rect_material";
import { Renderer } from "./renderer";

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * max) + min;
}
export function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new Renderer(canvas);
  const cam = new OrthoCamera(1024, 1024);
  // const _ = new CameraController(canvas, cam);

  const mat = new RectMaterial();
  let rects = [];
  const color: [number, number, number, number] = [1, 0, 0, 1];
  for (let i = 0; i < 4; i++) {
    rects.push(new Rect(-200, i * 200 - 400 + i * 50, 100, 100, mat, color));
  }
  renderer.add_elements(rects);

  renderer.add_color_wheel();
  renderer.set_cam(cam);

  const render = () => {
    renderer.render();
    requestAnimationFrame(render);
  };

  render();
}
