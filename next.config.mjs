/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PULIC_UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: `/a/${process.env.NEXT_PULIC_UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PULIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
};

export default nextConfig;
