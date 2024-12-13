module.exports = {
  images: {
    domains: ['hoanghamobile.com', 'cdn.discordapp.com', 'totp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
  basePath: '',
  trailingSlash: false
};
