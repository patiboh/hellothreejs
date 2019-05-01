import * as THREE from 'three';

let container;
let camera;
let scene;
let renderer;
let uniforms;

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

function init() {
  scene = new THREE.Scene();

  /**
  * Camera
  * */

  let geometry = new THREE.PlaneBufferGeometry(2, 2);
  uniforms = {
    u_time: { type: 'f', value: 1.0 },
    u_resolution: { type: 'v2', value: new THREE.Vector2() },
    u_mouse: { type: 'v2', value: new THREE.Vector2() },
  };

  geometry = new THREE.PlaneGeometry(10, 10 * 0.75);
  const loader = new THREE.TextureLoader();
  // Load an image file into a custom material
  const image = new THREE.MeshLambertMaterial({
    map: loader.load('./static/images/tupac.jpg'),
  });

  // const material = new THREE.ShaderMaterial({
  //   uniforms,
  //   vertexShader: vert,
  //   fragmentShader: frag,
  // });

  // Specify the portion of the scene visiable at any time (in degrees)
  const fieldOfView = 75;

  // Specify the camera's aspect ratio
  const aspectRatio = window.innerWidth / window.innerHeight;

  // Specify the near and far clipping planes. Only objects
  // between those planes will be rendered in the scene
  // (these values help control the number of items rendered
  // at any given time)
  const nearPlane = 0.1;
  const farPlane = 1000;

  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
  // Finally, set the camera's position in the z-dimension
  camera.position.z = 5;


  const mesh = new THREE.Mesh(geometry, image);
  scene.add(mesh);


  // Add a point light with #fff color, .7 intensity, and 0 distance
  const light = new THREE.PointLight(0xffffff, 1, 0);

  // Specify the light's position
  light.position.set(1, 1, 100);
  scene.add(light);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);


  document.title = '👾 ✨ 🐳';
  container = document.getElementById('root');
  if (module.hot) {
    module.hot.accept();
  }

  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  // document.onmousemove = (e) => {
  //   uniforms.u_mouse.value.x = e.pageX;
  //   uniforms.u_mouse.value.y = e.pageY;
  // };
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

init();
animate();
