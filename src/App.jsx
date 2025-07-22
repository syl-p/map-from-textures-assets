import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { TorusGeometry } from "three"
import Experience from "./Experience"
import { Perf } from 'r3f-perf'

function App() {
  return <>
    <Canvas
      shadows
      camera={{
        fov: 70,
        near: 0.1,
        far: 1000,
        position: [0, 20, 100]
      }}>
      <Experience />
      <Perf position="top-left"/>
    </Canvas>
  </>
}

export default App
