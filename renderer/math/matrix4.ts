export class Matrix4 {
  values: Float32Array;

  constructor() {
    this.values = new Float32Array(16);
    this.setIdentity();
  }

  setIdentity(): void {
    this.values[0] = 1;
    this.values[5] = 1;
    this.values[10] = 1;
    this.values[15] = 1;
    for (let i = 0; i < 16; i++) {
      if (i !== 0 && i !== 5 && i !== 10 && i !== 15) {
        this.values[i] = 0;
      }
    }
  }

  static ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    const mat = new Matrix4();
    mat.values[0] = 2 / (right - left);
    mat.values[5] = 2 / (top - bottom);
    mat.values[10] = -2 / (far - near);
    mat.values[12] = -(right + left) / (right - left);
    mat.values[13] = -(top + bottom) / (top - bottom);
    mat.values[14] = -(far + near) / (far - near);

    return mat;
  }

  multiply(other: Matrix4): Matrix4 {
    const result = new Matrix4();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.values[i * 4 + k] * other.values[k * 4 + j];
        }
        result.values[i * 4 + j] = sum;
      }
    }
    return result;
  }

  static translate(dx: number, dy: number, dz: number): Matrix4 {
    const mat = new Matrix4();
    mat.values[12] = dx;
    mat.values[13] = dy;
    mat.values[14] = dz;

    return mat;
  }

  static scale(sx: number, sy: number, sz: number): Matrix4 {
    const mat = new Matrix4();
    mat.values[0] = sx;
    mat.values[5] = sy;
    mat.values[10] = sz;

    return mat;
  }

  getValues(): Float32Array {
    return this.values;
  }
}
