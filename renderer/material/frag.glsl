#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vSize;
in vec2 vUv;
in vec4 vStrokeColor;
in vec3 vShapeInfo;

out vec4 fragColor;

float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0f) + length(max(q, 0.0f)) - r;
}

float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p - p0, v1 = p - p1, v2 = p - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0f, 1.0f);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0f, 1.0f);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0f, 1.0f);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}

void main() {

    float strokeWidth = vShapeInfo.x;
    float shapeType = vShapeInfo.y;
    float radius = vShapeInfo.z;

    vec2 pos = vec2(vUv.x, vUv.y) * vSize;

    float dist = 0.f;
    if(shapeType == 0.f) {
        vec2 p0 = -vSize * 0.5f + vec2(strokeWidth * 0.5f);
        vec2 p1 = -vSize * 0.5f + vec2(vSize.x, 0.0f) + vec2(-strokeWidth * 0.5f, strokeWidth * 0.5f);
        vec2 p2 = -vSize * 0.5f + vec2(vSize.x * 0.5f, vSize.y) - vec2(0.f, strokeWidth * 0.5f);
        dist = sdTriangle(pos - vSize * 0.5f, p0, p1, p2);
    } else {
        dist = sdRoundedBox(pos - vSize * 0.5f, vSize * 0.5f + vec2(-strokeWidth * 0.5f), radius);
    }

    // for anti-aliasing and soft edges
    float edge = smoothstep(-0.2f, 0.2f, abs(dist) - strokeWidth * 0.5f);

    vec4 color = (dist < 0.0f) ? vColor : vec4(0.0f, 0.0f, 0.0f, 0.0f);

    vec3 c = vec3(color.rgb) * color.a;

    fragColor = mix(vStrokeColor, color, edge);

}