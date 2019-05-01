import * as THREE from 'three';
import frag from './shaders/shaders.frag';
import vert from './shaders/shaders.vert';
import './styles.css';

let container;
let camera;
let scene;
let renderer;
let uniforms;

// eslint-disable-next-line no-unused-vars
function link() {
  const gl = renderer.context;

  const glVertexShader = new THREE.WebGLShader(gl, gl.VERTEX_SHADER, vert);
  const glFragmentShader = new THREE.WebGLShader(gl, gl.FRAGMENT_SHADER, frag);

  const program = gl.createProgram();

  gl.attachShader(program, glVertexShader);
  gl.attachShader(program, glFragmentShader);

  gl.linkProgram(program);
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}

// eslint-disable-next-line no-unused-vars
function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}


// const root = document.getElementById('root');

// root.innerHTML = '<div style="padding: 20px"><h1>Welcome to threejs</h1></div>';

// // This is needed for Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }
// const app = document.createElement('main');
// const text = document.createTextNode('Hello world!');

// app.appendChild(text);
// document.getElementById('root').appendChild(app);

function init() {
  container = document.getElementById('root');

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    u_time: { type: 'f', value: 1.0 },
    u_resolution: { type: 'v2', value: new THREE.Vector2() },
    u_mouse: { type: 'v2', value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.onmousemove = (e) => {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
