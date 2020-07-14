// @ts-check
/**
 ***********************
 * DRAW FUNCTIONS
 ***********************
 */

import * as utils from './utils.js'

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} width
 * @param {number} height
 */
export function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height

  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW)
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {number} count number of rectangles to draw
 */
function drawRectangles(gl, program, count) {
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
  // draw 50 random rectangles in random colors
  for (let index = 0; index < count; ++index) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
    draw.setRectangle(
      gl,
      utils.randomInt(300),
      utils.randomInt(300),
      utils.randomInt(300),
      utils.randomInt(300),
    )

    // Set a random color.
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    )

    /**
     * TRANSLATIONS
     */
    // Draw the rectangle.
    // WebGL has 3 types of primitives: points, lines, and triangles
    // const primitiveType = gl.TRIANGLES // each iteration, WebGL will draw a triangle based on the values set in gl_Position
    // const count = 6 // number of times the shader will execute: 3
    // 1st Iteration: a_position.x & a_position.y of the vertex shader will be set to the first 2 values in the positionBuffer
    // 2nd Iteration: a_position.x & a_position.y => next pair of values of positionBuffer
    // 3rd Iteration: a_position.x & a_position.y => next (last) pair of values of positionBuffer
    // offset = 0
    // gl.drawArrays(primitiveType, offset, count)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 */
export function drawScene(
  gl,
  program,
  resolutionUniformLocation,
  positionAttributeLocation,
  colorUniformLocation,
  positionBuffer,
) {
  const canvas = /** @type {HTMLCanvasElement} */ (gl.canvas)
  // 6. Setup canvas
  // - resize canvas to fit screen display
  utils.resize(canvas)
  // - tell WebGL how to covert clip space values for gl_Position back into screen space (pixels)
  // -> use gl.viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 7. Bind Position
  // - Enable data supply into vertex shader a_position attribute
  gl.enableVertexAttribArray(positionAttributeLocation)
  // - Bind data retrieval to position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  /**
   *  Tell the a_position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
   * - vec4 a_position is a 4 float vector. We only need 2 values for 2D (points x,y)
   * - default values are:  0, 0, 0, 1
   * - we will set the first two (x, y), and the remaining two (z, w) will remain with default values (0,1)
   */
}
