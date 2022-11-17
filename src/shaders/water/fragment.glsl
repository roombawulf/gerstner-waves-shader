uniform vec3 u_LightColor;
uniform vec3 u_LightColor2;
uniform float u_LightIntensity;

varying vec3 v_Normal;
varying vec3 v_SurfaceToLight;
varying vec3 v_SurfaceToLight2;


vec3 lightReflection(vec3 lightColor, vec3 surfaceToLight){
    // Normalise v_Normal 
    vec3 normal = normalize(v_Normal);
    // Set ambient, calculate dot product for light levels on normal faces
    vec3 ambient = lightColor;
    vec3 diffuse = lightColor * dot(surfaceToLight, normal);
    return (ambient + diffuse);
}

void main() {

    vec3 lightValue = lightReflection(u_LightColor, v_SurfaceToLight);
    lightValue *= u_LightIntensity;

    vec3 lightValue2 = lightReflection(u_LightColor2, v_SurfaceToLight2);
    lightValue2 *= 0.7;

    vec3 mixValue = mix(lightValue, lightValue2, 0.5);
    
    vec3 waterColor = vec3(0.6);

    gl_FragColor = vec4((waterColor * mixValue), 1.0);

}