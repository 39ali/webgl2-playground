export enum ShapeType {
  Tri,
  Rect,
}
export enum StrokePos {
  CENTER,
  OUTISIDE,
  INSIDE,
}
export enum FillType {
  SOLID,
  IMAGE,
}

export class Shape {
  type: ShapeType;

  dimension: { x: number; y: number; width: number; height: number };
  fill: { type: FillType; color: number[] };
  stroke: { type: FillType; color: number[] };
  stroke_width: number;
  stroke_pos: StrokePos;
  radius: number;

  constructor() {
    this.dimension = { x: 0, y: 0, width: 100, height: 100 };
    this.fill = { type: FillType.SOLID, color: [0, 0, 0, 1] };
    this.stroke = { type: FillType.SOLID, color: [0, 0, 0, 1] };
    this.stroke_width = 0;
    this.stroke_pos = StrokePos.INSIDE;
    this.radius = 1;
  }
  setDimension(info: { x: number; y: number; width: number; height: number }) {
    this.dimension = info;
  }
  addFill(info: { type: FillType; color: [number, number, number, number] }) {
    this.fill = info;
  }
  addStroke(info: { type: FillType; color: [number, number, number, number] }) {
    this.stroke = info;
  }
  setStrokePosition(pos: StrokePos) {
    this.stroke_pos = pos;
  }

  setStrokeWidth(w: number) {
    this.stroke_width = w;
  }

  setRadius(r: number) {
    this.radius = r;
  }
}
