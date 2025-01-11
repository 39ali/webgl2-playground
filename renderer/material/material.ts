//@ts-ignore
import vertexSrc from "./vert.glsl";
//@ts-ignore
import fragmentSrc from "./frag.glsl";
import { Renderer } from "../renderer";
import { OrthoCamera } from "../ortho_camera";

export class Material {
  program: WebGLProgram;
  projection_loc: WebGLUniformLocation;
  constructor(renderer: Renderer) {
    this.program = renderer.create_program_from_sources(vertexSrc, fragmentSrc);
    this.projection_loc = renderer.ctx.getUniformLocation(
      this.program,
      "u_projection"
    );
  }

  prepare(renderer: Renderer) {
    renderer.ctx.useProgram(this.program);
  }
  update_uniform(renderer: Renderer, cam: OrthoCamera) {
    renderer.ctx.uniformMatrix4fv(
      this.projection_loc,
      false,
      cam.get_mat().values
    );
  }
}
