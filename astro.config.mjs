import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import syntaxTheme from './syntax-theme.json';
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), tailwind()],
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
    }
  },
  adapter: netlify(),
  output: 'server',
  build: {
    format: 'directory'
  }
});