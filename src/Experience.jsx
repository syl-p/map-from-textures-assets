import { GizmoHelper, GizmoViewport, OrbitControls, } from "@react-three/drei"
import * as THREE from "three"
import Terrain from "./Terrain"
import { useState } from "react"
import Spawner from "./Spawner"

function Experience() {
    return <>
        <OrbitControls />
        <directionalLight position={[10, 30, 30]}/>
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