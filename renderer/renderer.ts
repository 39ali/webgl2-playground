import { Rectangle } from "./elements/rectangle";
import { ShapeType, StrokePos } from "./elements/shape";
import { Triangle } from "./elements/triangle";
import { Material } from "./material/material";
import { OrthoCamera } from "./ortho_camera";

export class Renderer {
  ctx: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  mat: Material;
  elements_count: number;
  dim_buffer: WebGLBuffer;
  colors_buffer: WebGLBuffer;
  stroke_color_buffer: WebGLBuffer;
  shape_info_buffer: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) {
      console.error("WebGL 2.0 is not available in your browser :(");
      return;
    }

    this.ctx = gl;
    this.ctx.clearColor(0.1, 0.1, 0.1, 1.0);
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
    this.ctx.blendEquation(this.ctx.FUNC_ADD);

    gl.enable(gl.BLEND);

    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));

    this.mat = new Material(this);
  }

  create_vertex_shader(src: string) {
    return this.create_shader(src, this.ctx.VERTEX_SHADER);
  }
  create_fragment_shader(src: string) {
    return this.create_shader(src, this.ctx.FRAGMENT_SHADER);
  }
  create_shader(src: string, type: GLenum) {
    const shader = this.ctx.createShader(type);
    this.ctx.shaderSource(shader, src);
    this.ctx.compileShader(shader);
    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      console.error("error compiling shader");
      console.log(src);
      console.error(this.ctx.getShaderInfoLog(shader));
      return;
    }
    return shader;
  }

  create_program(vertex: WebGLShader, fragment: WebGLShader) {
    const program = this.ctx.createProgram();
    this.ctx.attachShader(program, vertex);
    this.ctx.attachShader(program, fragment);
    this.ctx.linkProgram(program);
    if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
      console.error("error creating gl program");
      console.error(this.ctx.getProgramInfoLog(program));
      return;
    }

    return program;
  }

  create_program_from_sources(vertexSrc: string, fragmentSrc: string) {
    const vertex = this.create_vertex_shader(vertexSrc);
    const fragment = this.create_fragment_shader(fragmentSrc);
    return this.create_program(vertex, fragment);
  }

  render(cam: OrthoCamera) {
    if (!this.elements_count) return;

    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    this.mat.prepare(this);
    this.mat.update_uniform(this, cam);

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.dim_buffer);
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colors_buffer);
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.stroke_color_buffer);
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.shape_info_buffer);

    this.ctx.drawArraysInstanced(this.ctx.TRIANGLES, 0, 6, this.elements_count);
  }

  init_buffers(elements: (Rectangle | Triangle)[]) {
    const ctx = this.ctx;

    const num_instances = elements.length;
    const dims = new Float32Array(num_instances * 4);
    const colors = new Float32Array(num_instances * 4);
    const stroke_colors = new Float32Array(num_instances * 4);
    const shape_info = new Float32Array(num_instances * 3);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      let size_offset = 0;
      switch (el.stroke_pos) {
        case StrokePos.OUTISIDE: {
          size_offset += el.stroke_width;
          break;
        }
        case StrokePos.INSIDE: {
          break;
        }
        case StrokePos.CENTER: {
          size_offset += el.stroke_width * 0.5;
          break;
        }
      }

      dims[i * 4 + 0] = el.dimension.x;
      dims[i * 4 + 1] = el.dimension.y;
      dims[i * 4 + 2] = el.dimension.width + size_offset;
      dims[i * 4 + 3] = el.dimension.height + size_offset;

      colors[i * 4 + 0] = el.fill.color[0];
      colors[i * 4 + 1] = el.fill.color[1];
      colors[i * 4 + 2] = el.fill.color[2];
      colors[i * 4 + 3] = el.fill.color[3];

      stroke_colors[i * 4 + 0] = el.stroke.color[0];
      stroke_colors[i * 4 + 1] = el.stroke.color[1];
      stroke_colors[i * 4 + 2] = el.stroke.color[2];
      stroke_colors[i * 4 + 3] = el.stroke.color[3];

      // contains :(strokeWidth,shapeType ,radius)
      shape_info[i * 3 + 0] = el.stroke_width;
      shape_info[i * 3 + 1] = el.type === ShapeType.Rect ? 1 : 0;
      shape_info[i * 3 + 2] = el.radius;
    }

    this.dim_buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.dim_buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, dims, ctx.DYNAMIC_DRAW);
    const dim_loc = 0;
    ctx.enableVertexAttribArray(dim_loc);
    ctx.vertexAttribPointer(dim_loc, 4, ctx.FLOAT, false, 4 * 4, 0);
    ctx.vertexAttribDivisor(dim_loc, 1);

    // // upload the new matrix data
    // gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    // gl.bufferSubData(gl.ARRAY_BUFFER, 0, scales);

    this.colors_buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.colors_buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, colors, ctx.DYNAMIC_DRAW);
    const colors_loc = 1;
    ctx.vertexAttribPointer(colors_loc, 4, ctx.FLOAT, false, 4 * 4, 0);
    ctx.enableVertexAttribArray(colors_loc);
    ctx.vertexAttribDivisor(colors_loc, 1);

    this.stroke_color_buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.stroke_color_buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, stroke_colors, ctx.DYNAMIC_DRAW);
    const stroke_colors_loc = 2;
    ctx.vertexAttribPointer(stroke_colors_loc, 4, ctx.FLOAT, false, 4 * 4, 0);
    ctx.enableVertexAttribArray(stroke_colors_loc);
    ctx.vertexAttribDivisor(stroke_colors_loc, 1);

    this.shape_info_buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.shape_info_buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, shape_info, ctx.DYNAMIC_DRAW);
    const shape_info_loc = 3;
    ctx.vertexAttribPointer(shape_info_loc, 3, ctx.FLOAT, false, 4 * 3, 0);
    ctx.enableVertexAttribArray(shape_info_loc);
    ctx.vertexAttribDivisor(shape_info_loc, 1);
  }
  add_elements(elements: (Rectangle | Triangle)[]) {
    this.init_buffers(elements);
    this.elements_count = elements.length;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth * devicePixelRatio;
    this.canvas.height = window.innerHeight * devicePixelRatio;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}
