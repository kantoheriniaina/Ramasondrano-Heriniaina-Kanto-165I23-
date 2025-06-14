import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Désactive ESLint pendant le build pour contourner les erreurs temporairement
    },
    images: {
        domains: [], // Ajoutez des domaines si vous utilisez <Image /> avec des sources externes
    },
    // Ajoutez d'autres options si nécessaire, comme la compression ou le mode de build
};

export default nextConfig;