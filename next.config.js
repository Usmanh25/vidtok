/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'p16-sign-va.tiktokcdn.com', 
      'thenounproject.com', 
      'lh3.googleusercontent.com', 
      'p16-sign-sg.tiktokcdn.com',
      'p77-sign-va.tiktokcdn.com',
      'p77-sign-va-lite.tiktokcdn.com'
    ],
  }
}

module.exports = nextConfig
