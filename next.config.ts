/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude training-datasets folder from Next.js processing to avoid symbolic link issues
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/training-datasets/**', '**/node_modules/**']
    };
    return config;
  },
  // Exclude from static file serving
  async rewrites() {
    return [];
  }
};

export default nextConfig;
