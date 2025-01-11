import { OrthoCamera } from "../renderer/ortho_camera";
import { Rect } from "./rect/rect";
import { Renderer } from "./renderer";

export interface Material {
  is_ready: boolean;
  init(renderer: Renderer): void;
  prepare(element: Rect, renderer: Renderer, cam: OrthoCamera): void;
}
