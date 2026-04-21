'use client'

import { useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-driven Y translation (Parallax) and Fade-out for smooth scrolling experience
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  
  const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <motion.div
      ref={containerRef}
      style={{ y: canvasY, opacity: canvasOpacity }}
      className="hero-scene-wrapper"
    >
      <Spline scene="https://prod.spline.design/Uxx13DdRV6aOfxa8/scene.splinecode" />
      
      {/* 🛡️ Physical Patch to hide Spline watermark completely */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '60px',
          background: 'var(--bg-primary)',
          zIndex: 1000,
          pointerEvents: 'none'
        }} 
      />
    </motion.div>
  )
}
