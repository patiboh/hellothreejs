export default /* glsl */ `
#ifdef GL_ES
  precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a (fat, fuzzy) line on Y using a value between 0.0-1.0
float plot(vec2 coord, float pct){
  return  smoothstep( pct-0.02, pct,coord.y) -
          smoothstep( pct, pct+0.02,coord.y);
}

void main() {
    vec2 coord = gl_FragCoord.xy/u_resolution.xy;
    float x = coord.x;
    float y = coord.x;

    //*** *** *** *** *** ***//
    // Straight curve

    /// Change Angle 
    y = coord.x * 2.0;

    //*** *** *** *** *** ***//
    // Sinus curve

    y = sin(coord.x);
    
    /// Absolute value of sinus curve (all postive coordinates)
    // y = abs(sin(coord.x));

    /// Change curve amplitude - higher
    // y = sin(coord.x) * 2.0;
    // y = abs(sin(coord.x)) * 2.0;

    /// Change curve amplitude - lower
    // y = sin(coord.x) / 2.0;
    // y = abs(sin(coord.x)) / 2.0;
    
    /// Change curve period - higher
    // y = sin(coord.x * 20.0);
    // y = abs(sin(coord.x * 20.0));

    /// Change curve period - lower
    // y = sin(coord.x / 20.0);
    // y = abs(sin(coord.x / 20.0));

    //*** *** *** *** *** ***//
    // Cosinus curve

    // y = cos(coord.x);

    /// Absolute value of cosinus curve (all postive coordinates)
    // y = abs(cos(coord.x));
    
    /// Change curve amplitude - higher
    // y = cos(coord.x) * 2.0;
    // y = abs(cos(coord.x)) * 2.0;

    /// Change curve period - higher
    // y = cos(coord.x * 20.0);
    // y = abs(cos(coord.x * 20.0));

    //*** *** *** *** *** ***//
    // Step & Smoothstep : curves between two points

    // y = step(0.3,coord.x);
    // y = smoothstep(0.01, 0.99,coord.x);

    /// Symetrical curve on Three points
    // y = smoothstep(0.2,0.5,coord.x) - smoothstep(0.5,0.8,coord.x);

    //*** *** *** *** *** ***//
    // Curves + Time

    // y = sin(coord.x*PI*sin(u_time));
    // y = abs(sin(coord.x*PI*sin(u_time)));
    // y = fract(sin(coord.x*PI*sin(u_time)));
    // y = ceil(sin(coord.x*PI*cos(u_time))) + floor(sin(coord.x*PI*cos(u_time)));

    //*** *** *** *** *** ***//
    // Other GLSL functions
    y = mod(x,0.5); // return x modulo of 0.5
    // y = fract(x); // return only the fraction part of a number
    // y = ceil(x);  // nearest integer that is greater than or equal to x
    // y = floor(x); // nearest integer less than or equal to x
    // y = sign(x);  // extract the sign of x
    // y = abs(x);   // return the absolute value of x
    // y = clamp(x,0.0,1.0); // constrain x to lie between 0.0 and 1.0
    // y = min(0.0,x);   // return the lesser of x and 0.0
    // y = max(0.0,x);   // return the greater of x and 0.0 
    

    //*** *** *** *** *** ***//
    // Calculate pixel color
    
    // assign color according to y value (shade of gray)
    vec3 color = vec3(y);

    // Plot a line
    float pct = plot(coord,y);
    /// overload pixel color (shade of red) if coordinates fall on the fat fuzzy line
    color = (1.0-pct)*color+pct*vec3(1.0,0.0,0.0);

    gl_FragColor = vec4(color,1.0);
}
`;
