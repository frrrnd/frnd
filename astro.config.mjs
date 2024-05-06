import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import syntaxTheme from './syntax-theme.json';
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

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
  // output: "server",
  // adapter: netlify()
});