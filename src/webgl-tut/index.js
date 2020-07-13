// @ts-check
/**
 * **********************
 * HELPER FUNCTIONS
 * **********************
 * @param {WebGLRenderingContext} gl
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} width
 * @param {number} height
 */
function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height

  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x2, y2,
    x2, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW)
}

/**
 * Canvas, like Images, has 2 sizes
 * - Size the canvas is displayed: set with CSS
 * - Number of pixels displayed inside the canvas
 * @param {HTMLCanvasElement} canvas
 */
function resize(canvas) {
  // Get the size that the browser is displaying the canvas
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  // Check if the canvas is the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // If not, make it the same
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
}

/**
 * Use with caution, as this makes the WebGL program draw more pixels
 * -> it might be better to let the GPU take over
 * @param {WebGLRenderingContext} gl
 */
function resizeHD(gl) {
  const realToCSSPixels = window.devicePixelRatio
  const canvas = /** @type {HTMLCanvasElement} */ (gl.canvas)

  // - Get the size that the browser is displaying the canvas in CSS pixels
  // - Compute the size needed to make the drawing buffer match it in device pixels
  const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels)
  const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels)

  // Check if the canvas is the same size
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // If not, make it the same
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight
  }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl, type, source) {
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
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.error('💩 Could not compile shader \n\n')
  gl.deleteProgram(program)
}

function main() {
  /************************
   * INITIALIZATION CODE
   * Code that gets executed once before the program runs
   ************************/

  // 1. Get A WebGL context
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector(
    '#canvas',
  ))
  const gl = canvas.getContext('webgl')

  if (!gl) {
    alert("Sorry buddy, can't find WebGL in your browser ")
  }

  // 2. Initialize shaders : 2 programs that are executed each time a pixel is rendered
  // - Vertex Shader = returns pixel position
  // - Fragment Shader = returns pixel color
  const vertexShaderSrc = /** @type {HTMLScriptElement} */ (document.querySelector(
    '#vertex-shader-2d',
  )).text
  const fragmentShaderSrc = /** @type {HTMLScriptElement} */ (document.querySelector(
    '#fragment-shader-2d',
  )).text

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  // 3. Create WebGL program with the shaders
  const program = createProgram(gl, vertexShader, fragmentShader)

  // 7. Tell WebGL to use our shaders
  gl.useProgram(program)

  // 4. Bind resources / data
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()

  // bind our resource (the positions buffer) to a BIND_POINT on the GPU
  // so that we can pass data to it
  // always set this up before rendering loop
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Positions in clip space
  // const positions = [
  //   0,0,
  //   0,0.5,
  //   0.7, 0,
  // ]

  // Positions in pixels
  // prettier-ignore
  const positions = [
    20, 20,
    200, 20,
    20, 100,
    20, 100,
    200, 20,
    200, 100,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // 5. Set up Uniforms (~ globals)
  //  - sets uniforms to be bound to the current program

  // bind u_resolution
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution',
  )
  // bind u_color
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
  gl.uniform4f(
    colorUniformLocation,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  )

  /************************
   * RENDERING CODE
   * Code that gets executed every time we draw
   ************************/
  // 6. Setup canvas
  // - resize canvas to fit screen display
  resize(canvas)
  // - tell WebGL how to covert clip space values for gl_Position back into screen space (pixels)
  // -> use gl.viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

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
  const size = 2 // 2 components per iteration
  const type = gl.FLOAT // the data is in 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0 // 0: move forward (size * sizeof(type)) each iteration to get to the next position
  let offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  )

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  // 9. Draw !
  // WebGL has 3 types of primitives: points, lines, and triangles
  const primitiveType = gl.TRIANGLES // each iteration, WebGL will draw a triangle based on the values set in gl_Position
  const count = 6 // number of times the shader will execute: 3
  // 1st Iteration: a_position.x & a_position.y of the vertex shader will be set to the first 2 values in the positionBuffer
  // 2nd Iteration: a_position.x & a_position.y => next pair of values of positionBuffer
  // 3rd Iteration: a_position.x & a_position.y => next (last) pair of values of positionBuffer
  offset = 0
  gl.drawArrays(primitiveType, offset, count)
}

main()
