import { MeshStandardMaterial, ShaderMaterial } from 'three'


const terrainMaterial = new MeshStandardMaterial();

terrainMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = `
    // varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vRedMask;
    varying float vGreenMask;
    varying float vBlueMask;
    varying float vWhiteMask;


    attribute float redMask;
    attribute float greenMask;
    attribute float blueMask;
    attribute float whiteMask;

    ${shader.vertexShader}
  `.replace(
    `#include <uv_vertex>`,
    `#include <uv_vertex>
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vRedMask = redMask;
      vGreenMask = greenMask;
      vBlueMask = blueMask;
      vWhiteMask = whiteMask;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    `
  );

  shader.fragmentShader = `
      // varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vRedMask;
      varying float vGreenMask;
      varying float vBlueMask;
      varying float vWhiteMask;

      vec3 grass = vec3(0.2, 0.7, 0.2);
      vec3 sand = vec3(1.0, 0.8, 0.2);
      vec3 rock = vec3(0.2, 0.4, 0.8);
      // vec3 snow = vec3(0.9, 0.9, 0.9);


        ${shader.fragmentShader}
      `.replace(
    `#include <color_fragment>`,
    `
    // Appliquer les couleurs selon les masques
    vec3 baseColor = 
    vRedMask * grass +
    vGreenMask * grass +
    vBlueMask * rock +
    vWhiteMask * sand;

    baseColor = clamp(baseColor, 0.0, 1.0);


    diffuseColor.rgb = vec3(1, 0, 0);
    #include <color_fragment>
    `
  );
};

export default terrainMaterial
