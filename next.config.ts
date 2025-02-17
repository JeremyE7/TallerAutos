import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['primereact'],
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es'
  }
}

export default nextConfig
