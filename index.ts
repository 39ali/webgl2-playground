import * as ColorWheelExample from "./color_wheel/index";
import * as RendererExample from "./renderer/index";

function main() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const id = urlParams.get("id");
  if (id == "1" || id === null) {
    RendererExample.main();
  } else if (id == "2") {
    ColorWheelExample.main();
  }
}

main();
