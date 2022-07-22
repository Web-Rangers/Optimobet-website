/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        API_URL: "http://46.101.158.103:81/api",
        IMAGE_URL: "http://46.101.158.103:81"
    },
    images: {
        domains: ['46.101.158.103']
    }
}

module.exports = nextConfig
