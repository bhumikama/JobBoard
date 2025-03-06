/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,   // Add this line
  images: {
    unoptimized: false,
    domains: ["upskillpro.s3.eu-north-1.amazonaws.com"],
  },
};

export default nextConfig;
