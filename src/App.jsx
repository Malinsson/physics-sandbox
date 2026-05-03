// src/App.jsx
import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { PhysicsObject } from './components/PhysicsObject'

export default function App() {
  const [objects, setObjects] = useState([])
  const [shape, setShape] = useState('box')
  const [gravity, setGravity] = useState(-9.81)
  const [gravityKey, setGravityKey] = useState(0) // changing this remounts Physics

  // Drop object at a random position above the scene
  const dropObject = useCallback(() => {
    setObjects(prev => [
      ...prev,
      {
        id: Date.now(),
        shape,
        position: [
          (Math.random() - 0.5) * 4,
          6,
          (Math.random() - 0.5) * 4,
        ],
      },
    ])
  }, [shape])

  const clearAll = () => setObjects([])

  // Changing gravity requires remounting the Physics component
  const applyGravity = (val) => {
    setGravity(val)
    setGravityKey(k => k + 1)
    setObjects([])  // clear objects when resetting gravity
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Controls UI */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 10,
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        background: 'rgba(17, 17, 17, 0.85)',
        color: '#eee',
        borderRadius: 10,
        backdropFilter: 'blur(6px)'
      }}>
        <select value={shape} onChange={e => setShape(e.target.value)}>
          <option value="box">Box</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
        </select>

        <button onClick={dropObject}>Drop</button>
        <button onClick={clearAll}>Clear</button>


        {/* Make gravity presets instead */}
        <label>
          Gravity
          <input type="range" min={-20} max={0} step={0.5} value={gravity}
            onChange={e => applyGravity(Number(e.target.value))} />
          {gravity.toFixed(1)}
        </label>

        <span style={{ marginLeft: 'auto', opacity: 0.5 }}>{objects.length} objects</span>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 10, 20], fov: 70 }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={[2048, 2048]} 
        />
        <Environment preset="city" />
        <OrbitControls makeDefault target={[0, 1, 0]} />
        <Grid infiniteGrid sectionColor="#555" cellColor="#333" />

        <Physics key={gravityKey} gravity={[0, gravity, 0]}>
          {/* Floor */}
          <RigidBody type="fixed" friction={0.8}>
            <mesh receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[20, 0.5, 20]} />
              <meshStandardMaterial color="#2d2d2d" />
            </mesh>
          </RigidBody>

          {/* Dropped objects */}
          {objects.map(obj => (
            <PhysicsObject key={obj.id} shape={obj.shape} position={obj.position} />
          ))}
        </Physics>
      </Canvas>
    </div>
  )
}