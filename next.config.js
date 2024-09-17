/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }
    config.module.rules.push({
      test: /node_modules\/sharp/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-modules-commonjs', { importInterop: 'node' }]
            ]
          }
        }
      ]
    });
    return config;
  },
  // Add the following lines to ensure the server listens on all interfaces
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
};

module.exports = nextConfig;
