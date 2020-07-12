import * as THREE from 'three'
// import fragColor from './shaders/color.frag';
import fragCurves from '../shaders/curves.frag'
import vert from '../shaders/shaders.vert'

// Specify the light's position
const curvesCamera = () => {
  const cam = new THREE.Camera()
  cam.position.z = 1
  return cam
}

export const geometry = new THREE.PlaneBufferGeometry(2, 2)
export const uniforms = {
  u_time: { type: 'f', value: 1.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2() },
  u_mouse: { type: 'v2', value: new THREE.Vector2() }
}
const curvesMaterial = () => new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vert,
  fragmentShader: fragCurves
})
export const material = curvesMaterial()
export const camera = curvesCamera()
