// src/components/PhysicsObject.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

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
    collider: 'hull',
  },
}

const COLORS = ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#a8dadc']

export function PhysicsObject({ shape = 'box', position, onDragStart, onDragEnd }) {
  const bodyRef = useRef()
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const { geometry, collider } = SHAPES[shape]
  const [active, setActive] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef(new THREE.Vector3())
  const dragPlane = useMemo(() => new THREE.Plane(), [])
  const dragPoint = useRef(new THREE.Vector3())
  const dragNormal = useRef(new THREE.Vector3())
  const { camera, gl, pointer, raycaster } = useThree()

  function handleClick(e) {
    e.stopPropagation()
    bodyRef.current?.applyImpulse(
      { x: (Math.random() - 0.5) * 3, y: 6, z: (Math.random() - 0.5) * 3 },
      true,
    )
    bodyRef.current?.applyTorqueImpulse(
      { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 },
      true,
    )
  }

  function handlePointerDown(e) {
    e.stopPropagation()

    if (!bodyRef.current) return

    const bodyPosition = bodyRef.current.translation()

    dragOffset.current.set(
      e.point.x - bodyPosition.x,
      e.point.y - bodyPosition.y,
      e.point.z - bodyPosition.z,
    )

    camera.getWorldDirection(dragNormal.current)
    dragPlane.setFromNormalAndCoplanarPoint(
      dragNormal.current,
      new THREE.Vector3(bodyPosition.x, bodyPosition.y, bodyPosition.z),
    )

    setDragging(true)
    onDragStart?.()
  }

  useEffect(() => {
    if (!dragging) {
      bodyRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)
      bodyRef.current?.setAngvel({ x: 0, y: 0, z: 0 }, true)
      onDragEnd?.()
      return
    }

    const handlePointerMove = event => {
      if (!bodyRef.current) return

      const bounds = gl.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)

      raycaster.setFromCamera(pointer, camera)

      if (raycaster.ray.intersectPlane(dragPlane, dragPoint.current)) {
        bodyRef.current.setNextKinematicTranslation({
          x: dragPoint.current.x - dragOffset.current.x,
          y: dragPoint.current.y - dragOffset.current.y,
          z: dragPoint.current.z - dragOffset.current.z,
        })
      }
    }

    const handlePointerUp = () => {
      setDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [camera, dragPlane, dragging, gl, onDragEnd, pointer, raycaster])

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      type={dragging ? 'kinematicPosition' : 'dynamic'}
      colliders={collider}
      restitution={0.1}
      friction={1}
      linearDamping={0.35}
      angularDamping={0.65}
    >
      <mesh
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
        scale={dragging ? 1.1 : active ? 1.15 : 1}
        castShadow
      >
        {geometry}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}