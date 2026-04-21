'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Stars,
  Ring,
  Torus,
  useTexture
} from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

/* ─────────────────────────────── */
/*        Inner 3D Objects         */
/* ─────────────────────────────── */

function OrbitalRing({ radius = 1.6, speed = 0.5, color = '#7c5cfc' }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  return (
    <Torus ref={ref} args={[radius, 0.012, 16, 120]} rotation={[Math.PI / 3, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </Torus>
  )
}

function Moon() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Load textures from the public folder
  const [colorMap, normalMap] = useTexture([
    '/assets/moon.jpg',
    '/assets/normal.jpg'
  ])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * 0.05
      meshRef.current.rotation.y = clock.elapsedTime * 0.075
      meshRef.current.rotation.z = clock.elapsedTime * 0.05
    }
  })
  
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
        />
      </mesh>
    </Float>
  )
}

function SmallOrbs() {
  const positions: [number, number, number][] = [
    [2.8, 0.8, -0.5],
    [-2.6, -0.6, -0.8],
    [1.2, -2.2, 0.4],
    [-1.4, 2.0, -0.3],
  ]
  const colors = ['#4f8ef7', '#7c5cfc', '#00d4aa', '#f5c842']
  return (
    <>
      {positions.map(([x, y, z], i) => (
        <Float key={i} speed={1.2 + i * 0.3} floatIntensity={0.5}>
          <Sphere position={[x, y, z]} args={[0.12 + i * 0.03, 32, 32]}>
            <meshStandardMaterial
              color={colors[i]}
              emissive={colors[i]}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

/* ─────────────────────────────── */
/*      Mouse Parallax Camera      */
/* ─────────────────────────────── */

function ParallaxCamera({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>
}) {
  const { camera } = useThree()
  const targetX = useRef(0)
  const targetY = useRef(0)

  useFrame(() => {
    targetX.current += (mouse.current[0] * 0.6 - targetX.current) * 0.05
    targetY.current += (mouse.current[1] * 0.4 - targetY.current) * 0.05
    camera.position.x = targetX.current
    camera.position.y = targetY.current
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ─────────────────────────────── */
/*        Full Scene               */
/* ─────────────────────────────── */

function Scene({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#4f8ef7" />
      <pointLight position={[-5, -5, 3]} intensity={0.8} color="#7c5cfc" />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#00d4aa" />
      <Stars radius={60} depth={40} count={2000} factor={3} fade speed={0.5} />
      <Environment preset="night" />
      <Moon />
      <OrbitalRing radius={1.65} speed={0.4} color="#4f8ef7" />
      <OrbitalRing radius={2.1} speed={-0.25} color="#7c5cfc" />
      <OrbitalRing radius={2.6} speed={0.18} color="#00d4aa" />
      <SmallOrbs />
      <ParallaxCamera mouse={mouse} />
    </>
  )
}

/* ─────────────────────────────── */
/*        HeroScene (export)       */
/* ─────────────────────────────── */

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef<[number, number]>([0, 0])

  // Scroll-driven Y translation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      ]
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      style={{ y: canvasY, opacity: canvasOpacity }}
      className="hero-scene-wrapper"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </motion.div>
  )
}
