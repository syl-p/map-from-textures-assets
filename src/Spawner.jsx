import * as THREE from 'three'
import { useEffect, useRef } from 'react'

export default function Spawner({ geometry }) {
  const instancedRef = useRef()

  useEffect(() => {
    const positions = geometry.attributes.position
    const redMask = geometry.attributes.redMask

    const threshold = 0.6 // seuil de sampling
    const instancePositions = []

    for (let i = 0; i < positions.count; i++) {
      const mask = redMask.getX(i)
      if (mask > threshold) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)
        instancePositions.push(new THREE.Vector3(x, y, z))
      }
    }

    const dummy = new THREE.Object3D()
    instancePositions.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.5) // taille de la sphère
      dummy.updateMatrix()
      instancedRef.current.setMatrixAt(i, dummy.matrix)
    })

    instancedRef.current.count = instancePositions.length
    instancedRef.current.instanceMatrix.needsUpdate = true
  }, [geometry])

  return (
    <instancedMesh ref={instancedRef} args={[null, null, 1000]} castShadow receiveShadow>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="hotpink" />
    </instancedMesh>
  )
}
