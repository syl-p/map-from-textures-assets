import { ShaderMaterial } from 'three'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vRedMask;
  varying float vGreenMask;
  varying float vBlueMask;
  varying float vWhiteMask;

  attribute float redMask;
  attribute float greenMask;
  attribute float blueMask;
  attribute float whiteMask;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vRedMask = redMask;
    vGreenMask = greenMask;
    vBlueMask = blueMask;
    vWhiteMask = whiteMask;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vRedMask;
  varying float vGreenMask;
  varying float vBlueMask;
  varying float vWhiteMask;

    vec3 grass = vec3(0.2, 0.7, 0.2);
    vec3 sand = vec3(1.0, 0.8, 0.2);
    vec3 rock = vec3(0.2, 0.4, 0.8);
    // vec3 snow = vec3(0.9, 0.9, 0.9);

  void main() {
    // Détection pente via normale Y
    float slope = 1.0 - abs(vNormal.y);

    // Appliquer les couleurs selon les masques
    vec3 baseColor = 
        vRedMask * grass +
        vGreenMask * grass +
        vBlueMask * rock +
        vWhiteMask * sand;

    // baseColor = clamp(baseColor, 0.0, 1.0);


    // Appliquer couleur roche si pente forte
    // if (slope > 0.5) {
    //   baseColor = vec3(0.4, 0.4, 0.4); // Roche
    // }

    gl_FragColor = vec4(baseColor, 1.0);
  }
`

const terrainMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  vertexColors: false,
})

export default terrainMaterial