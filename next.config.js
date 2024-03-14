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
                destination: 'http://127.0.0.1:24601/ai/:path*'
            }
        ]
    }
}

module.exports = nextConfig
