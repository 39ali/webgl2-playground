#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform vec2 u_circle0_pos;
uniform vec2 u_circle1_pos;

out vec4 fragColor;

// SDF for hollow circle
float hollowCircleSDF(vec2 p, float innerRadius, float outerRadius) {
    float distToCenter = length(p);
    float outerDist = distToCenter - outerRadius;
    float innerDist = innerRadius - distToCenter;
    return max(outerDist, innerDist); // Positive outside the ring
}

vec3 hsbToRgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0f + vec3(0.0f, 4.0f, 2.0f), 6.0f) - 3.0f) - 1.0f, 0.0f, 1.0f);
    return c.z * mix(vec3(1.0f), rgb, c.y); // c.z is Brightness
}

void main() {
    // map to [-1,1]
    vec2 uv = vUv * 2.0f - 1.0f;
    float angle = atan(uv.y, uv.x); // Hue
    float radius = length(uv);     // Saturation

    // Normalize angle to [0, 1]
    float hue = mod(angle / (2.0f * 3.14159265f) + 1.0f, 1.0f);
    float saturation = clamp(radius, 0.0f, 1.0f);

    // Convert HSB to RGB (with Brightness = 1 for full brightness)
    float brightness = 1.0f;
    vec3 color = hsbToRgb(vec3(hue, saturation, brightness));

    // Alpha mask for outside the circle
    float alpha = 1.0f - smoothstep(0.99f, 1.f, radius);

    float circle0 = hollowCircleSDF(uv - u_circle0_pos, 0.05f, 0.06f);
    float circle1 = hollowCircleSDF(uv - u_circle1_pos, 0.05f, 0.06f);
    // Smooth edge for anti-aliasing
    float edge0 = smoothstep(-0.01f, 0.01f, circle0);
    float edge1 = smoothstep(-0.01f, 0.01f, circle1);
    float edge = edge0 == 1.0f ? edge1 : edge0;
    // Color the hollow circle
    vec3 c = mix(color, vec3(0.f), 1.0f - edge); // Black outside, white for the ring

    fragColor = vec4(c, alpha);

}