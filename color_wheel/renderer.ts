import { OrthoCamera } from "../renderer/ortho_camera";
import { ColorWheel, create_wheel } from "./color_wheel/wheel";
import { GradientMode, Rect } from "./rect/rect";
import { mapRange } from "./utils";

export class Renderer {
  ctx: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  aspect: number = 1;
  elements: Rect[] = [];
  color_wheel: ColorWheel;
  brightness_bar: Rect;
  cam: OrthoCamera;
  current_selected_element: Rect;
  color_html: HTMLElement;
  gradient_mode: GradientMode = GradientMode.Linear;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { antialias: true });
    if (!gl) {
      console.error("WebGL 2.0 is not available in your browser :(");
      return;
    }

    this.ctx = gl;
    this.ctx.clearColor(0.8, 0.8, 0.8, 1.0);
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
    this.ctx.blendEquation(this.ctx.FUNC_ADD);

    gl.enable(gl.BLEND);

    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));

    //setup html
    const gradient_html = document.getElementById("gradient");
    gradient_html.style.visibility = "visible";

    document.getElementById("Linear").addEventListener("click", () => {
      this.gradient_mode = GradientMode.Linear;
      this.update_element();
    });

    document.getElementById("Radial").addEventListener("click", () => {
      console.log("Radial");
      this.gradient_mode = GradientMode.Radial;
      this.update_element();
    });
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

  set_cam(cam: OrthoCamera) {
    this.cam = cam;
  }

  render() {
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);

    if (!this.cam) return;

    for (const el of this.elements) {
      el.material.prepare(el, this, this.cam);
      this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);
    }
  }

  add_elements(elements: Rect[]) {
    for (const el of elements) {
      el.material.init(this);
    }
    this.elements.push(...elements);
  }

  add_color_wheel() {
    if (this.color_wheel) return;
    this.color_wheel = create_wheel(100, 100, 400, 300, this.aspect);
    this.add_elements(this.color_wheel.get_elements());
    this.init_color_wheels_controls();
  }

  intersects_elements(x: number, y: number) {
    for (const el of this.elements) {
      if (this.color_wheel.is_color_wheel(el)) {
        continue;
      }

      const w = el.w;
      const h = el.h;

      if (el.x - w < x && el.x + w > x && el.y - h < y && el.y + h > y) {
        this.current_selected_element = el;

        break;
      }
    }
  }

  update_element() {
    if (this.current_selected_element) {
      this.current_selected_element.color0 = this.color_wheel.rgba0;
      this.current_selected_element.color1 = this.color_wheel.rgba1;
      this.current_selected_element.gradient_mode = this.gradient_mode;
    }
  }
  init_color_wheels_controls() {
    let is_dragging = false;
    let last_x = 0;
    let last_y = 0;
    this.canvas.addEventListener("mousedown", (event) => {
      is_dragging = true;
      last_x = event.clientX;
      last_y = event.clientY;
      const cam_pos_x = mapRange(
        event.clientX,
        0,
        this.canvas.width / devicePixelRatio,
        -this.cam.half_w,
        this.cam.half_w
      );
      const cam_pos_y = mapRange(
        event.clientY,
        0,
        this.canvas.height / devicePixelRatio,
        this.cam.half_h,
        -this.cam.half_h
      );

      this.color_wheel.update_picker(cam_pos_x, cam_pos_y);
      this.color_wheel.update_color_wheel(cam_pos_x, cam_pos_y);

      this.intersects_elements(cam_pos_x, cam_pos_y);
      this.update_element();
    });

    this.canvas.addEventListener("mousemove", (event) => {
      if (is_dragging) {
        const cam_pos_x = mapRange(
          event.clientX,
          0,
          this.canvas.width / devicePixelRatio,
          -this.cam.half_w,
          this.cam.half_w
        );
        const cam_pos_y = mapRange(
          event.clientY,
          0,
          this.canvas.height / devicePixelRatio,
          this.cam.half_h,
          -this.cam.half_h
        );

        this.color_wheel.update_color_wheel(cam_pos_x, cam_pos_y);
        this.update_element();
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      is_dragging = false;
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth * devicePixelRatio;
    this.canvas.height = window.innerHeight * devicePixelRatio;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.aspect = this.canvas.width / this.canvas.height;
    this.color_wheel?.set_aspect(this.aspect);
  }
}
