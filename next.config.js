/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  webpack: (config) => {
    // Handle Three.js and Monaco Editor properly
    config.externals = [...(config.externals || [])];
    return config;
  },
};

module.exports = nextConfig;
