import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

export default function CustomObject() {
    const objectRef = useRef()
    const verticesCount = 10 * 3

    const positions = useMemo(() => {
        const positions = new Float32Array(verticesCount * 3)
        for (let i = 0; i < verticesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3
        }

        return positions
    }, [])

    useEffect(() => {
        objectRef.current.computeVertexNormals()
    }, [positions])


    return <mesh>
        <bufferGeometry ref={objectRef}>
            <bufferAttribute 
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={positions}
            />
            <meshBasicMaterial color="red" side={ THREE.DoubleSide } />
        </bufferGeometry>
    </mesh>
}