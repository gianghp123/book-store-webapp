/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.gr-assets.com', // <--- Lỗi của bạn ở đây
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org', // Dùng trong ProductCard, ProductDetail
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Dùng trong CartManagement
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net', // Dùng trong PaymentForm
      },
    ],
  },
};

module.exports = nextConfig;