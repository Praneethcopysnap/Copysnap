/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude the figma-plugin directory from the build
  webpack: (config) => {
    config.externals = [...(config.externals || []), { 'figma': 'figma' }];
    return config;
  },
  // Disable TypeScript type checking for figma-plugin
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
