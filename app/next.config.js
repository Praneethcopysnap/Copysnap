/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode in development for better performance
  swcMinify: true, // Use SWC minification for faster builds
  experimental: {
    // Enable React concurrent features
    concurrentFeatures: true,
    // Enable server components
    serverComponents: true,
    // Optimize font loading
    optimizeFonts: true,
    // Improved image optimization
    images: {
      allowFutureImage: true,
    },
    // Increase performance budgets to allow for better initial load performance
    largePageDataBytes: 128 * 1000, // 128KB
    // Enable turbopack for faster development
    turbo: {
      loaders: {
        '.js': ['swc-loader'],
        '.ts': ['swc-loader'],
        '.tsx': ['swc-loader'],
      },
    },
  },
  // Optimize for production
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig; 