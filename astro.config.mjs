import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react({
      experimentalStyled: true, // Enable styled-components support
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  build: {
    assets: '_assets',
  },
  server: {
    port: 3000,
    host: true,
  },
});
