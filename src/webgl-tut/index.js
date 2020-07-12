/************************
 * HELPER FUNCTIONS
 ************************/

// Canvas, like Images, has 2 sizes
// - Size the canvas is displayed: set with CSS
// - Number of pixels displayed inside the canvas
function resize(canvas) {
  // Get the size that the browser is displaying the canvas
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // If not, make it the same
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

// Use with caution, as this makes the WebGL program draw more pixels
// -> it might be better to let the GPU take over

/* eslint-disable no-unused-vars */
function resizeHD(gl) {
  const realToCSSPixels = window.devicePixelRatio;

  // - Get the size that the browser is displaying the canvas in CSS pixels
  // - Compute the size needed to make the drawingbuffer match it in device pixels
  const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is the same size
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // If not, make it the same
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }
}
/* eslint-enable no-unused-vars */

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(
    "💩 Could not compile shader \n\n",
    gl.getShaderInfoLog(shader)
  );
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error("💩 Could not compile shader \n\n");
  gl.deleteProgram(program);
}

function main() {
  /************************
   * INITIALIZATION CODE
   * Code that gets executed once before the program runs
   ************************/

  // 1. Get A WebGL context
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("Sorry buddy, can't find WebGL in your browser ");
  }

  // 2. Initialize shaders : 2 programs that are executed each time a pixel is rendered
  // - Vertex Shader = returns pixel position
  // - Fragment Shader = returns pixel color
  const vertexShaderSrc = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSrc = document.querySelector("#fragment-shader-2d").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSrc
  );

  // 3. Create WebGL program with the shaders
  const program = createProgram(gl, vertexShader, fragmentShader);

  // 4. Bind resources / data
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();

  // bind our resource (the positions buffer) to a BIND_POINT on the GPU
  // so that we can pass data to it
  // always set up this before rendering loop
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Positions in clip space
  // const positions = [
  //   0,0,
  //   0,0.5,
  //   0.7, 0,
  // ]

  // Positions in pixels
  const positions = [
    15,
    12,
    290,
    12,
    15,
    142,
    290,
    12,
    290,
    142,
    15,
    142,
    // 10, 20,
    // 80, 20,
    // 10, 30,
    // 10, 30,
    // 80, 20,
    // 80, 30,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  gl.useProgram(program); // sets uniforms to be bound to the current program
  // bind u_resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  /************************
   * RENDERING CODE
   * Code that gets executed every time we draw
   ************************/
  // 5. Setup canvas
  // resize canvas to fit screen display
  resize(gl.canvas);
  // tell WebGL how to covert clip space values for gl_Position back into screen space (pixels)
  // -> use gl.viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 6. Tell WebGL to use our shaders
  gl.useProgram(program);

  // 8. Setup data supply from resource into position shader attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // 9. Setup data retrieval from position shader attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 10. Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

  /**
   * Size: 2 components per iteration:
   * - attribute vec4 a_position is a 4 float value, but we are only using 2 for now  (points x,y)
   *  - default values are:  0, 0, 0, 1
   * - we will set the first two (x, y), and the remaining two (z, w) will remain with default values (0,1)
   */
  const size = 2;
  const type = gl.FLOAT; // the data is in 32bit floats
  const normalize = false; // don't normaliza the data
  const stride = 0; // 0: move forward (size * sizeof(type)) each iteration to get to the next position
  let offset = 0; // start at the beginning of the buffer

  // Also binds the attribute to the current ARRAY_BUFFER (positionBuffer)
  // -> now that positionBuffer is bound to, ARRAY_BUFFER can be used to bind something else
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // WebGL has 3 types of primitives: points, lines, and triangles
  const primitiveType = gl.TRIANGLES; // each iteration, WebGL will draw a triangle based on the values set in gl_Position
  const count = 6; // number of times the shader will execute: 3
  // 1st Iteration: a_position.x & a_position.y of the vertex shader will be set to the first 2 values in the positionBuffer
  // 2nd Iteration: a_position.x & a_position.y => next pair of values of positionBuffer
  // 3rd Iteration: a_position.x & a_position.y => next (last) pair of values of positionBuffer
  offset = 0;
  gl.drawArrays(primitiveType, offset, count);
}

main();
