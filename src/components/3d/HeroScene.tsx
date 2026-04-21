'use client'

import { useRef } from 'react'
import Spline from '@splinetool/react-spline/next'
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
      <Spline scene="https://prod.spline.design/g9Cy1psmvDKYFoPv/scene.splinecode" />
    </motion.div>
  )
}
