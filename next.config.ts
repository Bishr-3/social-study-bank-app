import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow Three.js and react-three packages to be transpiled
  transpilePackages: ['three'],

  // Turbopack config (Next.js 15+)
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default nextConfig
