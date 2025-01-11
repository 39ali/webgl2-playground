import { Shape, ShapeType } from "./shape";

export class Rectangle extends Shape {
  constructor() {
    super();
    this.type = ShapeType.Rect;
  }
}
