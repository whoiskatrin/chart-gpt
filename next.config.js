/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  env: {
    GOOGLE_CLIENT_ID: 'your-google-client-id',
    GOOGLE_CLIENT_SECRET: 'your-google-client-secret',
  },
};
