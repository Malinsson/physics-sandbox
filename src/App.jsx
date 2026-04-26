import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider, BallCollider, CapsuleCollider } from '@react-three/rapier'
import { Suspense, useRef } from 'react'


export default function App() {

  const body = useRef();

    // Apply an instant force (like a throw)
  body.current.applyImpulse({ x: 0, y: 5, z: 0 }, true)

  // Apply a torque (spin it)
  body.current.applyTorqueImpulse({ x: 1, y: 0, z: 0 }, true)

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}
      style={{ width: '100%', height: '100%' }}>
        <Suspense>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls />
          <Physics gravity={[0, -9.81, 0]} debug>

            {/* Dynamic Box */}
            <RigidBody type="dynamic" position={[0, 5, 0]}>
              <mesh>
                <boxGeometry />
                <meshStandardMaterial color="coral" />
              </mesh>
            </RigidBody>

            <RigidBody type="dynamic" position={[2, 5, 0]}>
              <CuboidCollider args={[1, 1, 1]} />
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="lightblue" />
              </mesh>
            </RigidBody>

            <RigidBody type="dynamic" ref={body} position={[4, 5, 0]}>
              <CuboidCollider args={[1, 1, 1]} />
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="lightblue" />
              </mesh>
            </RigidBody>


            {/* Ground */}
            <RigidBody type="fixed">
              <mesh position={[0, -2, 0]}>
                <boxGeometry args={[10, 0.5, 10]} />
                <meshStandardMaterial color="#999" />
              </mesh>
            </RigidBody>
          </Physics>
        </Suspense>
    </Canvas>
  )
}