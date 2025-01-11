import { Matrix4 } from "./math/matrix4";
import { Vec2 } from "./math/vec2";

export class OrthoCamera {
  ortho: Matrix4;
  pos: Vec2;
  scale: number;
  needs_update: boolean;
  mat: Matrix4;
  half_w: number;
  half_h: number;

  constructor(width: number, height: number) {
    this.half_w = width * 0.5;
    this.half_h = height * 0.5;
    this.ortho = Matrix4.ortho(
      -this.half_w,
      this.half_w,
      -this.half_h,
      this.half_h,
      -1,
      1
    );
    this.pos = new Vec2(0, 0);
    this.scale = 1;
    this.needs_update = true;
  }

  zoom(z: number): void {
    this.scale += z;

    this.scale = Math.max(this.scale, 0.1);
    this.needs_update = true;
  }

  translate(dx: number, dy: number): void {
    this.pos.x += dx;
    this.pos.y += dy;
    this.needs_update = true;
  }

  get_mat() {
    if (this.needs_update) {
      this.needs_update = false;

      let s = Matrix4.scale(this.scale, this.scale, 1);
      let t = Matrix4.translate(this.pos.x, this.pos.y, 0);
      this.mat = this.ortho.multiply(s).multiply(t);
    }
    return this.mat;
  }
}
