precision mediump float;
attribute vec3 a_VertPosition;
attribute vec3 a_VertColor;

varying vec3 v_FragColor;

void main() {
    v_FragColor = a_VertColor;
    gl_Position = vec4(a_VertPosition, 1.0);
}