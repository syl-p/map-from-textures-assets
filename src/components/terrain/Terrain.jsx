import { Sampler } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import TerrainMaterial from './TerrainMaterial'

export default function Terrain() {
  const meshRef = useRef()
  const instancedMeshRef = useRef()
  const [geometry, setGeometry] = useState(null)
  const heightmap = useLoader(THREE.TextureLoader, '/dem.jpg')
  const splatmap = useLoader(THREE.TextureLoader, '/splatmap.png')

  useEffect(() => {
    const img = heightmap.image
    const splatImg = splatmap.image

    const RES = 128
    const HEIGHT_SCALE = 25

    // Canvas pour heightmap
    const heightCanvas = document.createElement('canvas')
    heightCanvas.width = RES
    heightCanvas.height = RES
    const heightCtx = heightCanvas.getContext('2d')
    heightCtx.drawImage(img, 0, 0, RES, RES)
    const heightData = heightCtx.getImageData(0, 0, RES, RES).data

    // Canvas pour splatmap
    const splatCanvas = document.createElement('canvas')
    splatCanvas.width = RES
    splatCanvas.height = RES
    const splatCtx = splatCanvas.getContext('2d')
    splatCtx.drawImage(splatImg, 0, 0, RES, RES)
    const splatData = splatCtx.getImageData(0, 0, RES, RES).data

    const planeGeo = new THREE.PlaneGeometry(RES, RES, RES - 1, RES - 1)
    const position = planeGeo.attributes.position
    const redMask = new Float32Array(position.count)
    const greenMask = new Float32Array(position.count)
    const blueMask = new Float32Array(position.count)
    const whiteMask = new Float32Array(position.count)

    for (let i = 0; i < position.count; i++) {
      const x = i % RES
      const y = Math.floor(i / RES)
      const idx = (y * RES + x) * 4

      // Hauteur
      const heightValue = heightData[idx] / 255
      const ease = (t) => Math.pow(heightValue, 3)
      const elevation = ease(heightValue) * HEIGHT_SCALE
      position.setZ(i, elevation)

        const r = splatData[idx] / 255
        const g = splatData[idx + 1] / 255
        const b = splatData[idx + 2] / 255

        // On veut un canal dominant. On élimine les pixels où deux couleurs sont trop proches.
        const isRed = r > 0.5 && g < 0.2 && b < 0.2
        const isGreen = g > 0.5 && r < 0.2 && b < 0.2
        const isBlue = b > 0.5 && r < 0.2 && g < 0.2

        redMask[i] = isRed ? 1 : 0
        greenMask[i] = isGreen ? 1 : 0
        blueMask[i] = isBlue ? 1 : 0
        whiteMask[i] = (r > 0.9 && g > 0.9 && b > 0.9) ? 1 : 0

    }

    position.needsUpdate = true
    planeGeo.computeVertexNormals()

    planeGeo.setAttribute('redMask', new THREE.BufferAttribute(redMask, 1))
    planeGeo.setAttribute('greenMask', new THREE.BufferAttribute(greenMask, 1))
    planeGeo.setAttribute('blueMask', new THREE.BufferAttribute(blueMask, 1))
    planeGeo.setAttribute('whiteMask', new THREE.BufferAttribute(whiteMask, 1))
    setGeometry(planeGeo)
  }, [heightmap, splatmap])

  if (!geometry) return null

  return <>
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation-x={-Math.PI / 2}
      receiveShadow
      castShadow
    >
      <TerrainMaterial />
    </mesh>

    {/** Sampler qui va échantillonner en fonction de redMask */}
    <Sampler
      mesh={meshRef}
      instances={instancedMeshRef}
      count={200}
      weight="redMask"
        transform={({ position, dummy})  => {
          dummy.position.copy(position)
          dummy.rotation.x = -Math.PI / 2

          dummy.rotation.y = Math.random() * Math.PI 
          dummy.scale.setScalar(0.5 + Math.random() * 1.2)

          dummy.updateMatrix()
        }}
    />

    <instancedMesh
      ref={instancedMeshRef}
      args={[null, null, 200]}
      castShadow
      receiveShadow
      rotation-x={-Math.PI / 2}
    >
      <sphereGeometry args={[0.3]} />
      <meshStandardMaterial color="green" />
    </instancedMesh>
  </>
}
