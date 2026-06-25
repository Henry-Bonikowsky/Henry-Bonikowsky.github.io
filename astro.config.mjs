import { defineConfig } from 'astro/config';

// User page: deploys to the domain root, so no base prefix.
export default defineConfig({
  site: 'https://henry-bonikowsky.github.io',
  base: '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
