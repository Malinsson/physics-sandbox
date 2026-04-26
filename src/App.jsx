import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls />
      <Physics>
        <RigidBody>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="coral" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed">
          <mesh position={[0, -2, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="#999" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  )
}