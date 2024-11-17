module.exports = {
  images: {
    domains: ['hoanghamobile.com', 'assets.example.com'],
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
