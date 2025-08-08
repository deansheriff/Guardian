import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
      }
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.storage_NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.storage_NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
