/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Figma plugin from the build
  webpack: (config, { isServer }) => {
    // Add 'figma' as an external dependency
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('figma');
    } else {
      config.externals = ['figma', ...(config.externals ? [config.externals] : [])];
    }
    
    return config;
  },
  // Disable TypeScript errors for the Figma plugin
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimize production build
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  // Ignore ESLint errors during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Turn off features that may cause instability
    serverComponentsExternalPackages: [],
    instrumentationHook: false
  }
};

module.exports = nextConfig;
