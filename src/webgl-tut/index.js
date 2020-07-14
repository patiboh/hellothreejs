// @ts-check
import * as utils from './utils.js'
import * as utilsWebGl from './utilsWebGL.js'
import * as draw from './draw.js'

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

  try {
    const vertexShader = utilsWebGl.createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSrc,
    )
    const fragmentShader = utilsWebGl.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSrc,
    )
    // 3. Create WebGL program with the shaders
    const program = utilsWebGl.createProgram(gl, vertexShader, fragmentShader)

    // 7. Tell WebGL to use our shaders
    gl.useProgram(program)

    // 4. Bind resources / data
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position',
    )
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
    // bind u_color
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    )

    // bind u_translation
    const translationUniformLocation = gl.getUniformLocation(
      program,
      'u_translation',
    )

    // bind u_resolution
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      'u_resolution',
    )

    /**
     * TRANSLATIONS
     */
    const translation = [0, 0]
    const width = 100
    const height = 30
    const color = [Math.random(), Math.random(), Math.random(), 1]
    draw.drawScene(
      gl,
      program,
      resolutionUniformLocation,
      positionAttributeLocation,
      colorUniformLocation,
      positionBuffer,
    )
    // Setup a rectangle
    draw.setRectangle(gl, translation[0], translation[1], width, height) // set the color

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
    var primitiveType = gl.TRIANGLES
    offset = 0
    var count = 6
    const rectangularFireworks = window.setInterval(() => {
      gl.drawArrays(primitiveType, offset, count)
    }, 1)

    const confetti = document.getElementsByClassName('confetti')
    utils.updateCursor(document.body, 0x1f4ab, 'LG')
    // this = animate button
    utils.updateCursor(this, 0x1f4a5, 'SM')

    Array.from(confetti).map((element) => {
      if (element.classList.contains('yay')) {
        element.classList.toggle('yay')
      }
    })
    window.setTimeout(() => {
      Array.from(confetti).map((element) => {
        element.classList.toggle('yay')
      })
      // this = animate button
      utils.updateCursor(this, 0x26a1, 'SM')
      window.clearInterval(rectangularFireworks)
    }, 1000)
  } catch (error) {
    utils.updateCursor(document.body, 0x1f4a9, 'LG')
    console.error(error)
  }
}
utils.updateCursor(document.body, 0x1f941, 'LG')
const animate = document.getElementById('animate')
animate.addEventListener('click', main)
