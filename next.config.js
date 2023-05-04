/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback ={ fs: false}; // the solution
    
    return config;
  },
}

module.exports = nextConfig
