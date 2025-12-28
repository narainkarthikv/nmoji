import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react({
      experimentalStyled: true,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  build: {
    assets: '_assets',
    // Optimize production builds
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  server: {
    port: 3000,
    host: true,
  },
  // Improve performance and SEO
  trailingSlash: 'never',
  // Prefetch DNS for external resources
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    // Optimize Vite bundling
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'emoji-data': ['./src/components/EmojiApp'],
          },
        },
      },
    },
    // Improve dev server performance
    server: {
      middlewareMode: false,
    },
  },
  // Image optimization
  image: {
    remotePatterns: [],
  },
});
