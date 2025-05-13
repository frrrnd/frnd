import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import syntaxTheme from './syntax-theme.json';
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react()],
  devToolbar: {
    enabled: false
  },
  markdown: {
    shikiConfig: {
      theme: syntaxTheme
    }
  },
  server: {
    port: 1234,
    host: true
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      }
    },
    define: {
      'import.meta.env.SPOTIFY_CLIENT_ID': JSON.stringify(process.env.SPOTIFY_CLIENT_ID),
      'import.meta.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(process.env.SPOTIFY_CLIENT_SECRET),
      'import.meta.env.SPOTIFY_REFRESH_TOKEN': JSON.stringify(process.env.SPOTIFY_REFRESH_TOKEN),
    },
    vite: {
      envPrefix: 'SPOTIFY_'
    },
    resolve: {
      alias: {
        '@layouts': '/src/layouts',
        '@utils': '/src/utils',
        '@partials': '/src/partials',
        '@components': '/src/components',
        '@api': '/src/pages/api',
      }
    }
  },
  // adapter: netlify(),
  output: 'static',
  build: {
    format: 'directory'
  },
  applyBaseStyles: false,
});