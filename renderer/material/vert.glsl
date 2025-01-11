#version 300 es

layout(location = 0) in vec4 dim;
layout(location = 1) in vec4 color;
layout(location = 2) in vec4 strokeColor;
// contains :(strokeWidth,shapeType ,radius)
layout(location = 3) in vec3 shapeInfo;

out vec4 vColor;
out vec2 vUv;
out vec2 vSize;
out vec4 vStrokeColor;
out vec3 vShapeInfo;

uniform mat4 u_projection;

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
    vec2 s = vec2(vertices[gl_VertexID].xy) * vec2(dim.zw) + vec2(dim.xy);
    gl_Position = u_projection * vec4(s, 0.0f, 1.0f);
    vColor = color;
    vUv = vec2(vertices[gl_VertexID].zw);
    vSize = dim.zw;
    vStrokeColor = strokeColor;
    vShapeInfo = shapeInfo;

}