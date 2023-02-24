/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'p16-sign-va.tiktokcdn.com', 
      'lh3.googleusercontent.com', 
      'p16-sign-sg.tiktokcdn.com',
      'www.shutterstock.com',
      'p77-sign-va.tiktokcdn.com',
      'p77-sign-va-lite.tiktokcdn.com'
    ],
  }
}

module.exports = nextConfig
