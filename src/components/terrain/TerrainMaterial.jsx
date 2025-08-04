import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useStore } from '../../stores/settings'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'
import { useFrame } from '@react-three/fiber'

export default function TerrainMaterial() {
  const waterLevel = useStore((state) => state.waterLevel)
  const foamDepth = useStore((state) => state.foamDepth)
  const waveAmplitude = useStore((state) => state.waveAmplitude)
  const waveSpeed = useStore((state) => state.waveSpeed)
  const materialRef = useRef()

  const { SAND_BASE_COLOR, GRASS_BASE_COLOR, UNDERWATER_BASE_COLOR } = useControls("Terrain", {
    SAND_BASE_COLOR: { value: "#ff9900", label: "Sand" },
    GRASS_BASE_COLOR: { value: "#85a02b", label: "Grass" },
    UNDERWATER_BASE_COLOR: { value: "#118a4f", label: "Underwater" }
  })

  const GRASS_COLOR = useMemo(
    () => new THREE.Color(GRASS_BASE_COLOR),
    [GRASS_BASE_COLOR]
  )
  
  const UNDERWATER_COLOR = useMemo(
    () => new THREE.Color(UNDERWATER_BASE_COLOR),
    [UNDERWATER_BASE_COLOR]
  )

  useEffect(() => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uGrassColor.value = GRASS_COLOR
    materialRef.current.uniforms.uUnderwaterColor.value = UNDERWATER_COLOR
    materialRef.current.uniforms.uWaterLevel.value = waterLevel
    materialRef.current.uniforms.uFoamDepth.value = foamDepth
  }, [
    GRASS_COLOR,
    UNDERWATER_COLOR,
    waterLevel,
    foamDepth
  ])

  useFrame(({ clock }) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return <CustomShaderMaterial
    ref={materialRef}
    baseMaterial={THREE.MeshStandardMaterial}
    color={SAND_BASE_COLOR}
    vertexShader={vertexShader}
    fragmentShader={fragmentShader}
    uniforms={{
      uTime: { value: 0 },
      uGrassColor: { value: GRASS_COLOR },
      uUnderwaterColor: { value: UNDERWATER_COLOR },
      uWaterLevel: { value: waterLevel },
      uFoamDepth: { value: foamDepth },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveSpeed: { value: waveSpeed }
    }}
    transparent
  />
}
