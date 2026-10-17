import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { menuFromCSV } from './scripts/menu.mjs';

export default defineConfig({
  root: '.',
  // Don't set publicDir to 'assets' — let the project serve assets at /assets/
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      // Serve menu.json on-the-fly from data/menu.csv during dev
      name: 'menu-dev-server',
      configureServer(server) {
        server.middlewares.use('/data/menu.json', (_req, res) => {
          try {
            const csv = readFileSync('data/menu.csv', 'utf8');
            const items = menuFromCSV(csv);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              configured: false,
              source: 'local-csv',
              updatedAt: new Date().toISOString(),
              items,
            }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      },
    },
  ],
});
