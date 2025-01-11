export function mapRange(
  x: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return outMin + ((x - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

export function mod(x: number, y: number) {
  return x - y * Math.floor(x / y);
}

export function hs_from_pos(x: number, y: number): [number, number] {
  const angle = Math.atan2(y, x); // Hue
  const radius = Math.sqrt(x * x + y * y); // Saturation

  const hue = mod(angle / (2.0 * 3.14159265) + 1.0, 1.0);
  const saturation = clamp(radius, 0.0, 1.0);

  return [hue, saturation];
}

export function hsb_to_rgb(
  hue: number,
  saturation: number,
  brightness: number
): [number, number, number] {
  // Ensure hue is in the range [0, 1]
  hue = hue % 1;
  if (hue < 0) hue += 1;

  const k = (n: number) => (hue * 6 + n) % 6;
  const f = (n: number) =>
    brightness * (1 - saturation * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

  const r = f(5);
  const g = f(3);
  const b = f(1);

  return [r, g, b];
}

export function len(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}

export function rgba_to_hex([r, g, b, a]: [number, number, number, number]) {
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  const alpha = Math.round(a * 255);

  // Convert to two-digit hexadecimal strings
  const hex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${hex(red)}${hex(green)}${hex(blue)}${hex(alpha)}`;
}
