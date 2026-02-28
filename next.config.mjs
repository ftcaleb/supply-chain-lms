/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        // Local Moodle instance (development)
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        // Production Moodle — update hostname when deploying
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
