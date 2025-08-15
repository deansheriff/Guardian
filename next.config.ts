import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
       protocol: 'https',
       hostname: 'vrbxfvpodigctasdvjvp.supabase.co',
      }
   ],
 },
};

export default nextConfig;
