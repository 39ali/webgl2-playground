#version 300 es
precision highp float;

in vec2 vUv;

uniform vec4 u_color0;
uniform vec4 u_color1;
// linear 1 , radial 0
uniform float u_gradient_mode;

out vec4 fragColor;

const float gradient_radius = 0.5f;
void main() {

    vec4 color;
    if(u_gradient_mode == 1.f) {
        color = mix(u_color0, u_color1, vUv.x);

    } else {
        float dist = distance(vUv, vec2(0.5f));
        // normalize dist based on gradient_radius
        float t = clamp(dist / gradient_radius, 0.0f, 1.0f);
        color = mix(u_color0, u_color1, t);

    }

    fragColor = color;
}