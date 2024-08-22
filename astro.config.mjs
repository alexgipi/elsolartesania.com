import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import critters from "astro-critters";
import vtbot from "astro-vtbot";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [svelte(), tailwind(), critters(), vtbot({
    loadingIndicator: false,
    autoLint: false
  })],
  adapter: node({
    mode: "standalone"
  }),
  trailingSlash: 'never'
});