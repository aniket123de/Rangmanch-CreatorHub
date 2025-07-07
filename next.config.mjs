/** @type {import('next').NextConfig} */
const nextConfig = {
    
    images:{
        domains:['cdn-icons-png.flaticon.com'],
        unoptimized:true
    },
    
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' localhost:* 127.0.0.1:* *.vercel.app *.netlify.app https:",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
