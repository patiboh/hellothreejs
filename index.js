import * as THREE from "three";
import frag from "./shaders.frag.js";
import vert from "./shaders.vert.js";
var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function link() {
  var gl = renderer.context;

  var glVertexShader = new THREE.WebGLShader(gl, gl.VERTEX_SHADER, vert);
  var glFragmentShader = new THREE.WebGLShader(gl, gl.FRAGMENT_SHADER, frag);

  var program = gl.createProgram();

  gl.attachShader(program, glVertexShader);
  gl.attachShader(program, glFragmentShader);

  gl.linkProgram(program);
}

function init() {
  container = document.getElementById("container");

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  var geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vert,
    fragmentShader: frag
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  document.onmousemove = function(e) {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}
