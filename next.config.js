/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverMinification: false,
    optimizeCss: true,
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        "mongodb-client-encryption": false,
        "aws4": false,
        "kerberos": false,
        "supports-color": false,
        "snappy": false,
        "bson-ext": false,
        "@mongodb-js/zstd": false,
        "mongodb": require.resolve("mongodb"),
      }
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  }
}

module.exports = nextConfig
