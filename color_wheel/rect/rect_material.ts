//@ts-ignore
import vertexSrc from "./vert.glsl";
//@ts-ignore
import fragmentSrc from "./frag.glsl";
import { Material } from "../material";
import { Renderer } from "../renderer";
import { Rect } from "./rect";
import { OrthoCamera } from "../../renderer/ortho_camera";

export class RectMaterial implements Material {
  program: WebGLProgram;
  is_ready: boolean = false;
  projection_loc: WebGLUniformLocation;
  dim_loc: WebGLUniformLocation;
  color0_loc: WebGLUniformLocation;
  color1_loc: WebGLUniformLocation;
  u_gradient_mode_loc: WebGLUniformLocation;

  init(renderer: Renderer) {
    if (this.is_ready) return;
    this.is_ready = true;
    this.program = renderer.create_program_from_sources(vertexSrc, fragmentSrc);

    this.projection_loc = renderer.ctx.getUniformLocation(
      this.program,
      "u_projection"
    );

    this.dim_loc = renderer.ctx.getUniformLocation(this.program, "u_dim");

    this.color0_loc = renderer.ctx.getUniformLocation(this.program, "u_color0");
    this.color1_loc = renderer.ctx.getUniformLocation(this.program, "u_color1");
    this.u_gradient_mode_loc = renderer.ctx.getUniformLocation(
      this.program,
      "u_gradient_mode"
    );
  }
  prepare(element: Rect, renderer: Renderer, cam: OrthoCamera): void {
    renderer.ctx.useProgram(this.program);
    renderer.ctx.uniformMatrix4fv(
      this.projection_loc,
      false,
      cam.get_mat().values
    );
    renderer.ctx.uniform4f(
      this.dim_loc,
      element.x,
      element.y,
      element.w,
      element.h
    );
    renderer.ctx.uniform4fv(this.color0_loc, element.color0);
    renderer.ctx.uniform4fv(this.color1_loc, element.color1);
    renderer.ctx.uniform1f(this.u_gradient_mode_loc, element.gradient_mode);
  }
}
