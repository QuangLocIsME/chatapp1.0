module.exports = {
  images: {
    domains: ['hoanghamobile.com', 'cdn.discordapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
};
