import * as THREE from 'three';

import { uniforms, geometry, material, camera } from './xp/curves';
// import { uniforms, geometry, material, light, camera } from './xp/images';


import './styles.css';

let container;
let app;
let renderer;

const render = (_scene, _camera) => {
  uniforms.u_time.value += 0.05;
  renderer.render(_scene, _camera);
};

const animate = (_scene, _camera) => {
  requestAnimationFrame(animate);
  render(_scene, _camera);
};

// eslint-disable-nex =t-line no-unused-vars
const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
};

const scene = new THREE.Scene();

const init = (_uniforms, _geometry, _material, _light) => {
  container = document.getElementById('root');
  app = document.createElement('main');
  const mesh = new THREE.Mesh(_geometry, _material);
  scene.add(mesh);
  if (_light) scene.add(_light);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  document.title = '✨👾 🐳';
  if (module.hot) {
    module.hot.accept();
  }

  container.appendChild(app);
  app.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.onmousemove = (e) => {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };
};

init(uniforms, geometry, material, null);
animate(scene, camera);
