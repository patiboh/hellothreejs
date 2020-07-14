// @ts-check
/**
 ***********************
 * HELPER FUNCTIONS
 ***********************
 */

const customCursor_LG =
  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" style="font-size: 100px;"><text y="100">REPL</text></svg>\'), auto'

const customCursor_SM =
  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" style="font-size: 40px;"><text y="40">REPL</text></svg>\'), auto'

/**
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
    x1, y2,
    x1, y2,
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

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range)
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
 * Link shaders to WebGL rendering context
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
    console.log('🎉 Rectangular fireworks! Yay! \n\n')
    return program
  }

  console.error('💩 Could not compile shader \n\n')
  gl.deleteProgram(program)
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
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300),
    )

    // Set a random color.
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    )
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

function drawScene() {}

function main() {
  /************************
   * INITIALIZATION CODE
   * Code that gets executed once before the program runs
   ************************/

  // 1. Get A WebGL context
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    'canvas',
  ))
  const gl = canvas.getContext('webgl')

  if (!gl) {
    alert("Sorry buddy, can't find WebGL in your browser ")
  }

  // 2. Initialize shaders : 2 programs that are executed each time a pixel is rendered
  // - Vertex Shader = returns pixel position
  // - Fragment Shader = returns pixel color
  const vertexShaderSrc = /** @type {HTMLScriptElement} */ (document.getElementById(
    'vertex-shader-2d',
  )).text
  const fragmentShaderSrc = /** @type {HTMLScriptElement} */ (document.getElementById(
    'fragment-shader-2d',
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
  // 6. Setup canvas
  // - resize canvas to fit screen display
  resize(canvas)
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

  /************************
   * RENDERING CODE
   * Code that gets executed every time we draw
   ************************/
  // 9. Draw !
  // WebGL has 3 types of primitives: points, lines, and triangles
  // const primitiveType = gl.TRIANGLES // each iteration, WebGL will draw a triangle based on the values set in gl_Position
  // const count = 6 // number of times the shader will execute: 3
  // 1st Iteration: a_position.x & a_position.y of the vertex shader will be set to the first 2 values in the positionBuffer
  // 2nd Iteration: a_position.x & a_position.y => next pair of values of positionBuffer
  // 3rd Iteration: a_position.x & a_position.y => next (last) pair of values of positionBuffer
  // offset = 0
  // gl.drawArrays(primitiveType, offset, count)

  // let repl_cursor =
  //   'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="30" style="font-size: 20px;"><text id="gText_11081308229940" name="-1" x="790.251953" y="-631.9517" font="Arial" rotate="0" horizAnchor="middle" vertAnchor="middle" scale="4,4" width="1" stroke="0x000000">&#x0048;&#x0045;&#x004C;&#x004C;&#x004F;&#x0020;&#x0057;&#x004F;&#x0052;&#x004C;&#x0044;&#x0021;&#x0021;&#x0021;&#x0021;</text></svg>\'), auto'
  // document.body.style.cursor = repl_cursor

  const rectangularFireworks = window.setInterval(() => {
    drawRectangles(gl, program, 6)
  }, 1)
  const confetti = document.getElementsByClassName('confetti')
  document.body.style.cursor = customCursor_LG.replace(
    'REPL',
    String.fromCodePoint(0x1f4ab),
  )
  // this = animate button
  this.style.cursor = customCursor_SM.replace(
    'REPL',
    String.fromCodePoint(0x1f4a5),
  )

  Array.from(confetti).map((element) => {
    if (element.classList.contains('curtain-call-tada')) {
      element.classList.toggle('curtain-call-tada')
    }
    if (element.classList.contains('curtain-call-star')) {
      element.classList.toggle('curtain-call-star')
    }
    if (element.classList.contains('curtain-call-balloon')) {
      element.classList.toggle('curtain-call-balloon')
    }
    if (element.classList.contains('curtain-call-confetti-ball')) {
      element.classList.toggle('curtain-call-confetti-ball')
    }
    if (element.classList.contains('curtain-call-party-face')) {
      element.classList.toggle('curtain-call-party-face')
    }
  })
  window.setTimeout(() => {
    Array.from(confetti).map((element) => {
      if (element.classList.contains('tada')) {
        element.classList.toggle('curtain-call-tada')
      }
      if (element.classList.contains('star')) {
        element.classList.toggle('curtain-call-star')
      }
      if (element.classList.contains('balloon')) {
        element.classList.toggle('curtain-call-balloon')
      }
      if (element.classList.contains('confetti-ball')) {
        element.classList.toggle('curtain-call-confetti-ball')
      }
      if (element.classList.contains('party-face')) {
        element.classList.toggle('curtain-call-party-face')
      }
    })
    // this = animate button
    this.style.cursor = customCursor_SM.replace(
      'REPL',
      String.fromCodePoint(0x26a1),
    )
    window.clearInterval(rectangularFireworks)
  }, 1000)
}
document.body.style.cursor = customCursor_LG.replace(
  'REPL',
  String.fromCodePoint(0x1f941),
)
const animate = document.getElementById('animate')
animate.addEventListener('click', main)
