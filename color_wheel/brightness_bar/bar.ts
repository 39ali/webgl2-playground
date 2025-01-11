import { Material } from "../material";
import { Rect } from "../rect/rect";
import { clamp } from "../utils";
import { BarMaterial } from "./bar_material";

export const create_brightness_bar = (
  w: number,
  h: number,
  x: number,
  y: number,
  aspect: number
) => {
  const mat = new BarMaterial();
  return new brightnessBar(x, y, w, h, mat, aspect);
};

export class brightnessBar extends Rect {
  slider_pos: number = 0.5;
  hs: [number, number] = [198, 96];
  aspect: number;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    mat: Material,
    aspect: number
  ) {
    super(x, y, w, h, mat, null);
    this.aspect = aspect;
  }

  intersects(x: number, y: number) {
    const w = this.w * this.aspect * 0.5;
    const h = this.h;
    return this.x - w < x && this.x + w > x && this.y - h < y && this.y + h > y;
  }

  update_slider(y: number) {
    // convert to [0,1] relative to bar
    const py = ((y - this.y) / this.h + 1) * 0.5;
    this.slider_pos = clamp(py, 0, 1);
  }
}
