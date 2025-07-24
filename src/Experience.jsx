import { GizmoHelper, GizmoViewport, OrbitControls, Sky, } from "@react-three/drei"
import * as THREE from "three"
import Terrain from "./Terrain"
import { useState } from "react"
import Spawner from "./Spawner"

function Experience() {
    return <>
        <OrbitControls />
        <Sky />
        <directionalLight               
                intensity={1.65}
              castShadow
              position={[-15, 30, 15]}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.00005} />
        <ambientLight />
        <Terrain/>

        <GizmoHelper
            alignment="bottom-right" // widget alignment within scene
            margin={[80, 80]} // widget margins (X, Y)
            >
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
    </>
}

export default Experience