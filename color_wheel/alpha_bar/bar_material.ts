//@ts-ignore
import vertexSrc from "./vert.glsl";
//@ts-ignore
import fragmentSrc from "./frag.glsl";
import { Material } from "../material";
import { Renderer } from "../renderer";
import { OrthoCamera } from "../../renderer/ortho_camera";
import { AlphaBar } from "./bar";

export class BarMaterial implements Material {
  program: WebGLProgram;
  is_ready: boolean = false;
  projection_loc: WebGLUniformLocation;
  dim_loc: WebGLUniformLocation;
  hsb_loc: WebGLUniformLocation;
  slider_pos_loc: WebGLUniformLocation;

  init(renderer: Renderer) {
    if (this.is_ready) return;
    this.is_ready = true;
    this.program = renderer.create_program_from_sources(vertexSrc, fragmentSrc);

    this.projection_loc = renderer.ctx.getUniformLocation(
      this.program,
      "u_projection"
    );

    this.dim_loc = renderer.ctx.getUniformLocation(this.program, "u_dim");
    this.hsb_loc = renderer.ctx.getUniformLocation(this.program, "u_hsb");
    this.slider_pos_loc = renderer.ctx.getUniformLocation(
      this.program,
      "u_slider_pos"
    );
  }
  prepare(element: AlphaBar, renderer: Renderer, cam: OrthoCamera): void {
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
      element.w / element.aspect,
      element.h
    );

    renderer.ctx.uniform3f(
      this.hsb_loc,
      element.hsb[0],
      element.hsb[1],
      element.hsb[2]
    );

    renderer.ctx.uniform1f(this.slider_pos_loc, element.slider_pos);
  }
}
