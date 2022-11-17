#define PI 3.14159265359

uniform float u_Time;

// Vec4 => (X Direction, Z Direction, Steepness, Wavelength)
uniform vec4 u_Wave1; 
uniform vec4 u_Wave2;
uniform vec4 u_Wave3;

// Light Position Uniforms
uniform vec3 u_LightPos;
uniform vec3 u_LightPos2;
uniform vec3 u_CameraPos;

varying vec3 v_Normal;
varying vec3 v_SurfaceToLight;
varying vec3 v_SurfaceToLight2;
varying vec3 v_SurfaceToCamera;

// Generate Gertsner Wave
vec3 gertsnerWave(vec4 wave, vec3 point, inout vec3 tangent, inout vec3 binormal){
    vec2 d = normalize(wave.xy);
    float s = wave.z; // steepness
    float lambda = wave.w; // wavelength
    float k = 2.0 * PI / lambda;
    float c = sqrt(1.0 / k); // Should be 9.81 / k but reduced for slower speed.
    float f = k * (dot(d, point.xz) - (c * u_Time));
    

    // Compute normals, then pass to the fragment shader
    tangent += vec3(-d.x * d.x * (s * sin(f)), 
                         d.x * (s * cos(f)), 
                         -d.x * d.y * (s * sin(f)));
    binormal += vec3(-d.x * d.y * (s * sin(f)), 
                          d.y * (s * cos(f)), 
                          -d.y * d.y * (s * sin(f)));
    
    return vec3(d.x * (s / k * cos(f)),
                s / k * sin(f),
                d.y * (s / k * cos(f)));
}

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Model position of plane
    vec3 gridPoint = vec3(modelPosition.xyz);

    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 point = gridPoint;

    point += gertsnerWave(u_Wave1, gridPoint, tangent, binormal);
    point += gertsnerWave(u_Wave2, gridPoint, tangent, binormal);
    point += gertsnerWave(u_Wave3, gridPoint, tangent, binormal);

    v_Normal = normalize(cross(binormal, tangent));
    modelPosition.xyz = point;
    vec3 worldPosition = vec3(modelPosition.xyz);


    // Compute the vector of surface to the lights, then pass to fragment shader
    v_SurfaceToLight = u_LightPos - worldPosition;
    v_SurfaceToLight2 = u_LightPos2 - worldPosition;

    // // NOT USED 
    // // Compute the vector of surface to the camera, then pass to fragment shader
    vec3 worldCameraPos = u_CameraPos;
    v_SurfaceToCamera = worldCameraPos - worldPosition;

    //  Model/World Space -> View Space -> Projected Space
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}