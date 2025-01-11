import { Vec2 } from "../../renderer/math/vec2";
import { AlphaBar, create_alpha_bar } from "../alpha_bar/bar";
import { brightnessBar, create_brightness_bar } from "../brightness_bar/bar";
import { Material } from "../material";
import { Rect } from "../rect/rect";
import {
  clamp,
  hs_from_pos,
  hsb_to_rgb,
  len,
  mod,
  rgba_to_hex,
} from "../utils";
import { ColorWheelMaterial } from "./wheel_material";

export const create_wheel = (
  w: number,
  h: number,
  x: number,
  y: number,
  aspect: number
) => {
  const brightness_bar = create_brightness_bar(10, 100, 300, 300, aspect);
  const alpha_bar = create_alpha_bar(10, 100, 200, 300, aspect);
  const mat = new ColorWheelMaterial();
  return new ColorWheel(x, y, w, h, mat, aspect, brightness_bar, alpha_bar);
};

enum SelectedCircle {
  Circle0,
  Circle1,
  None,
}
enum SelectedBar {
  Brightness,
  Alpha,
  None,
}
export class ColorWheel extends Rect {
  aspect: number;
  circle0_pos: Vec2 = new Vec2(0, 0);
  circle1_pos: Vec2 = new Vec2(-0.5, 0);
  selected_circle: SelectedCircle = SelectedCircle.Circle0;
  prev_selected_circle: SelectedCircle = SelectedCircle.Circle0;
  selected_bar: SelectedBar = SelectedBar.None;
  hsb0: [number, number, number] = [0, 0, 1];
  hsb1: [number, number, number] = [0, 0, 1];
  rgba0: [number, number, number, number] = [1, 0, 0, 1];
  rgba1: [number, number, number, number] = [1, 0, 0, 1];

  brightness_bar: brightnessBar;
  alpha_bar: AlphaBar;
  color_html: HTMLElement;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    mat: Material,
    aspect: number,
    brightness_bar: brightnessBar,
    alpha_bar: AlphaBar
  ) {
    super(x, y, w, h, mat, null);
    this.aspect = aspect;
    this.brightness_bar = brightness_bar;
    this.alpha_bar = alpha_bar;

    this.hsb0 = [
      ...hs_from_pos(this.circle0_pos.x, this.circle0_pos.y),
      this.brightness_bar.slider_pos,
    ];
    this.hsb1 = [
      ...hs_from_pos(this.circle1_pos.x, this.circle1_pos.y),
      this.brightness_bar.slider_pos,
    ];

    this.brightness_bar.hs = [this.hsb0[0], this.hsb0[1]];
    this.alpha_bar.hsb = this.hsb0;

    this.rgba0 = [
      ...hsb_to_rgb(this.hsb0[0], this.hsb0[1], this.hsb0[2]),
      this.alpha_bar.slider_pos,
    ];
    this.rgba1 = [
      ...hsb_to_rgb(this.hsb1[0], this.hsb1[1], this.hsb1[2]),
      this.alpha_bar.slider_pos,
    ];

    //setup color html
    this.color_html = document.getElementById("color-hex");
    this.color_html.style.visibility = "visible";
  }

  update_color_wheel(x: number, y: number) {
    const w = this.w * this.aspect * 0.5;
    const h = this.h;
    // intersects wheel
    if (this.x - w < x && this.x + w > x && this.y - h < y && this.y + h > y) {
      if (this.selected_circle == SelectedCircle.Circle0) {
        const cx = (x - this.x) / (this.w / this.aspect);
        const cy = (y - this.y) / this.h;
        const l = len(cx, cy);
        if (l <= 1.0) {
          this.circle0_pos.x = cx;
          this.circle0_pos.y = cy;
          const hs = hs_from_pos(this.circle0_pos.x, this.circle0_pos.y);
          this.hsb0 = [...hs, this.hsb0[2]];
          this.brightness_bar.hs = [this.hsb0[0], this.hsb0[1]];
          this.alpha_bar.hsb = this.hsb0;
        }
      } else if (this.selected_circle == SelectedCircle.Circle1) {
        const cx = (x - this.x) / (this.w / this.aspect);
        const cy = (y - this.y) / this.h;
        const l = len(cx, cy);
        if (l <= 1.0) {
          this.circle1_pos.x = cx;
          this.circle1_pos.y = cy;

          const hs = hs_from_pos(this.circle1_pos.x, this.circle1_pos.y);
          this.hsb1 = [...hs, this.hsb1[2]];

          this.brightness_bar.hs = [this.hsb1[0], this.hsb1[1]];
          this.alpha_bar.hsb = this.hsb1;
        }
      }
    }

    switch (this.selected_bar) {
      case SelectedBar.Alpha: {
        this.alpha_bar.update_slider(y);
        if (this.prev_selected_circle === SelectedCircle.Circle0) {
          this.rgba0[3] = this.alpha_bar.slider_pos;
        } else if (this.prev_selected_circle == SelectedCircle.Circle1) {
          this.rgba1[3] = this.alpha_bar.slider_pos;
        }
        break;
      }

      case SelectedBar.Brightness: {
        this.brightness_bar.update_slider(y);
        if (this.prev_selected_circle === SelectedCircle.Circle0) {
          this.hsb0[2] = this.brightness_bar.slider_pos;
        } else if (this.prev_selected_circle === SelectedCircle.Circle1) {
          this.hsb1[2] = this.brightness_bar.slider_pos;
        }
        break;
      }
    }

    this.convert_to_rgb();
  }

  update_picker(x: number, y: number) {
    // convert to [-1,1] relative to color wheel
    const px = (x - this.x) / (this.w / this.aspect);
    const py = (y - this.y) / this.h;
    const circle_radius = 0.1;
    if (
      px > this.circle0_pos.x - circle_radius &&
      px < this.circle0_pos.x + circle_radius &&
      py > this.circle0_pos.y - circle_radius &&
      py < this.circle0_pos.y + circle_radius
    ) {
      //circle 0 selected
      this.prev_selected_circle = this.selected_circle = SelectedCircle.Circle0;
      this.selected_bar = SelectedBar.None;
    } else if (
      px > this.circle1_pos.x - circle_radius &&
      px < this.circle1_pos.x + circle_radius &&
      py > this.circle1_pos.y - circle_radius &&
      py < this.circle1_pos.y + circle_radius
    ) {
      //"circle 1  selected"
      this.prev_selected_circle = this.selected_circle = SelectedCircle.Circle1;
      this.selected_bar = SelectedBar.None;
    } else {
      if (this.selected_circle !== SelectedCircle.None) {
        this.prev_selected_circle = this.selected_circle;
      }

      this.selected_circle = SelectedCircle.None;

      if (this.alpha_bar.intersects(x, y)) {
        this.selected_bar = SelectedBar.Alpha;
      } else if (this.brightness_bar.intersects(x, y)) {
        this.selected_bar = SelectedBar.Brightness;
      } else {
        this.selected_bar = SelectedBar.None;
      }
    }
  }

  convert_to_rgb() {
    this.rgba0 = [
      ...hsb_to_rgb(this.hsb0[0], this.hsb0[1], this.hsb0[2]),
      this.rgba0[3],
    ];

    this.rgba1 = [
      ...hsb_to_rgb(this.hsb1[0], this.hsb1[1], this.hsb1[2]),
      this.rgba1[3],
    ];

    if (this.prev_selected_circle === SelectedCircle.Circle0) {
      this.color_html.innerHTML = "color: " + rgba_to_hex(this.rgba0);
    } else if (this.prev_selected_circle === SelectedCircle.Circle1) {
      this.color_html.innerHTML = "color: " + rgba_to_hex(this.rgba1);
    }
  }

  get_elements() {
    return [this, this.brightness_bar, this.alpha_bar];
  }

  is_color_wheel(el: Rect) {
    return this === el || this.brightness_bar === el || this.alpha_bar == el;
  }

  set_aspect(aspect: number) {
    this.aspect = aspect;
    this.brightness_bar.aspect = this.aspect;
    this.alpha_bar.aspect = this.aspect;
  }
}
