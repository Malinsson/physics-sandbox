// src/components/PhysicsObject.jsx
import { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'

const SHAPES = {
  box: {
    geometry: <boxGeometry args={[0.8, 0.8, 0.8]} />,
    collider: 'cuboid',
  },
  sphere: {
    geometry: <sphereGeometry args={[0.5, 16, 16]} />,
    collider: 'ball',
  },
  cylinder: {
    geometry: <cylinderGeometry args={[0.4, 0.4, 1, 12]} />,
    collider: 'hull',  // hull = auto-fit convex hull, good for cylinders
  },
}

const COLORS = ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#a8dadc']

export function PhysicsObject({ shape = 'box', position }) {
  const bodyRef = useRef()
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const { geometry, collider } = SHAPES[shape]

  function handleClick(e) {
    e.stopPropagation()
    // Fling upward with random spin on click
    bodyRef.current?.applyImpulse({ x: (Math.random()-0.5)*3, y: 6, z: (Math.random()-0.5)*3 }, true)
    bodyRef.current?.applyTorqueImpulse(
      { x: Math.random()*2, y: Math.random()*2, z: Math.random()*2 },
      true
    )
  }

  return (
    <RigidBody ref={bodyRef} position={position} colliders={collider} restitution={0.4} friction={0.7}>
      <mesh onClick={handleClick} castShadow>
        {geometry}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}