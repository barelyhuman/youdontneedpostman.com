import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'events', 'util'],
      globals: { Buffer: true, process: true, global: true },
    }),
  ],
  optimizeDeps: {
    include: ['@usebruno/converters'],
  },
  resolve: {
    alias: {
      'graceful-fs': 'node:fs',
    },
  },
})
