// @ts-check
import * as utils from './utils.js'
import * as utilsWebGl from './utilsWebGL.js'
import * as draw from './draw.js'

function main() {
  // this = "Animate" button
  this.classList.add('active')
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
  const confetti = document.getElementsByClassName('confetti')
  const poop = document.getElementsByClassName('poop')

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
    const rectangularFireworks = window.setInterval(() => {
      // Draw random rectangles 3 times (in theory 🤔)
      draw.drawRectangles(gl, colorUniformLocation, 3)
    }, 1)

    utils.updateCursor(document.body, 0x2728, 'LG') // ✨ sparkles
    // this = animate button
    if (this.classList.contains('success')) {
      utils.updateCursor(this, 0x1f4a5, 'SM') // 💥 fire spark
    }

    Array.from(confetti).map((element) => {
      element.classList.remove('yay')
    })
    Array.from(poop).map((element) => {
      element.classList.remove('nay')
    })
    window.setTimeout(() => {
      this.classList.remove('active')
      this.classList.remove('error')
      this.classList.add('success')
      // this = animate button
      utils.updateCursor(this, 0x1f64c, 'SM') // 🙌 raised hands
      Array.from(confetti).map((element) => {
        element.classList.add('yay')
      })
      window.clearInterval(rectangularFireworks)
    }, 1000)
  } catch (error) {
    Array.from(poop).map((element) => {
      element.classList.add('nay')
    })
    utils.updateCursor(document.body, 0x1f47b, 'LG') // 👻 ghost
    // utils.updateCursor(animate, 0x1f327, 'SM') // 🌧 cloud with rain
    utils.updateCursor(animate, 0x1f52b, 'SM') // 🔫 water pistol
    this.classList.remove('active')
    this.classList.remove('success')
    this.classList.add('error')
    console.error(error)
  }
}
utils.updateCursor(document.body, 0x1f941, 'LG') // 🥁 drums
const animate = document.getElementById('animate')
utils.updateCursor(animate, 0x26a1, 'SM') // ⚡️ lightning
animate.addEventListener('click', main)
