#version 300 es
precision highp float;

in vec2 vUv;

out vec4 fragColor;

uniform vec2 u_hsb; // Base hue and saturation from the brightness bar 
uniform float u_slider_pos;
float sdfRectangle(vec2 p, vec2 center, vec2 size) {
    vec2 d = abs(p - center) - size * 0.5f;

    return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f);
}

vec3 hsbToRgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0f + vec3(0.0f, 4.0f, 2.0f), 6.0f) - 3.0f) - 1.0f, 0.0f, 1.0f);
    return c.z * mix(vec3(1.0f), rgb, c.y);
}
void main() {
    float brightness = vUv.y;
    vec3 color = hsbToRgb(vec3(u_hsb.x, u_hsb.y, brightness));

    vec3 c = sdfRectangle(vUv, vec2(0.0f, u_slider_pos), vec2(2.0f, 0.03f)) < 0.f ? vec3(0.7f) : color;

    fragColor = vec4(c, 1.0f);
}
