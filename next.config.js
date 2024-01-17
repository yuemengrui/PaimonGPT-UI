/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    images: {unoptimized: true},
    webpack: (config) => {
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader',
            exclude: /node_modules/
        });

        return config;
    },

    // dev
    async rewrites() {
        return [
            {
                source: '/ai/:path*',
                destination: 'http://134.175.246.119:9236/ai/:path*',
            }
        ]
    }
}

module.exports = nextConfig
