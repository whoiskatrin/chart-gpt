import { withAxiom } from "next-axiom";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

const path = require("path");

module.exports = withAxiom({
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
});
