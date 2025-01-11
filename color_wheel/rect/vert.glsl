#version 300 es

out vec2 vUv;

uniform mat4 u_projection;
uniform vec4 u_dim;

const vec4 vertices[6] = vec4[6](
     // Position    // UV
vec4(-1.0f, 1.0f, 0.0f, 1.0f), // Top-left
vec4(1.0f, 1.0f, 1.0f, 1.0f), // Top-right
vec4(-1.0f, -1.0f, 0.0f, 0.0f), // Bottom-left
vec4(-1.0f, -1.0f, 0.0f, 0.0f), // Bottom-left
vec4(1.0f, 1.0f, 1.0f, 1.0f), // Top-right
vec4(1.0f, -1.0f, 1.0f, 0.0f) // Bottom-right
);

void main() {
    vec2 s = vec2(vertices[gl_VertexID].xy) * vec2(u_dim.zw) + vec2(u_dim.xy);
    gl_Position = u_projection * vec4(s, 0.0f, 1.0f);
    vUv = vec2(vertices[gl_VertexID].zw);
}