'use client'

import dynamic from 'next/dynamic'

// 3D canvas must be rendered client-side only (no SSR)
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="hero-scene-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="hero-scene-loader" />
    </div>
  ),
})

export default HeroScene
