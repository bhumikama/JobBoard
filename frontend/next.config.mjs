/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: false,
    domains: ["upskillpro.s3.eu-north-1.amazonaws.com"],
  },
};

export default nextConfig;
