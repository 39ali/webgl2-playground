import { Shape, ShapeType } from "./shape";

export class Triangle extends Shape {
  constructor() {
    super();
    this.type = ShapeType.Tri;
  }
}
