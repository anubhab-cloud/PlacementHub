/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  // ── Next.js 16: Turbopack is the default bundler ──────────────
  // turbopack.root fixes the "package-lock.json outside git repo" warning
  // that occurs when the project lives inside OneDrive.
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
