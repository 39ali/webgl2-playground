import { Material } from "../material";

export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  color0: [number, number, number, number];
  color1: [number, number, number, number];
  gradient_mode: GradientMode = GradientMode.Linear;
  needs_update: boolean;
  material: Material;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    mat: Material,
    color?: [number, number, number, number]
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.material = mat;
    this.color0 = color;
    this.color1 = color;
  }
}

export enum GradientMode {
  Radial,
  Linear,
}
