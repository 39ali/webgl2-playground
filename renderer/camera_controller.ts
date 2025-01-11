import { OrthoCamera } from "./ortho_camera";

const zoom_factor = 0.001;
const speed = 0.005;
export class CameraController {
  private camera: OrthoCamera;

  constructor(canvas: HTMLCanvasElement, cam: OrthoCamera) {
    this.camera = cam;

    canvas.addEventListener("wheel", (event) => {
      const val = event.deltaY * zoom_factor;
      this.camera.zoom(val);
    });

    let is_dragging = false;
    let last_x = 0;
    let last_y = 0;

    canvas.addEventListener("mousedown", (event) => {
      is_dragging = true;
      last_x = event.clientX;
      last_y = event.clientY;
    });

    canvas.addEventListener("mousemove", (event) => {
      if (is_dragging) {
        const dx = event.clientX - last_x;
        const dy = event.clientY - last_y;
        this.pan(dx, dy);
        last_x = event.clientX;
        last_y = event.clientY;
      }
    });

    canvas.addEventListener("mouseup", () => {
      is_dragging = false;
    });
  }

  private pan(dx: number, dy: number): void {
    const pan_x = dx * speed;
    const pan_y = dy * speed;
    this.camera.translate(pan_x, -pan_y);
  }
}
