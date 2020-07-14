// @ts-check
/**
 ***********************
 * WebGL HELPER FUNCTIONS (setup)
 ***********************
 */

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.error('💩 Could not compile shader \n\n', gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

/**
 * Link shaders to WebGL rendering context
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    console.log('🎉 Rectangular fireworks! Yay! \n\n')
    return program
  }

  console.error('💩 Could not compile shader \n\n')
  gl.deleteProgram(program)
}
