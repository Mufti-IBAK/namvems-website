/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // This is your Supabase Project Ref followed by .supabase.co
        hostname: 'urxtcvdfumrmjhjspaci.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/event-images/**',
      },
      // You can also add other hostnames here if needed in the future
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  // --- END OF BLOCK ---
};

export default nextConfig;