import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import preact from '@preact/preset-vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

/**
 * The @usebruno/converters ESM bundle contains bare require() calls for
 * jscodeshift, lodash/cloneDeep, and xml2js.  These are left over from the
 * CJS source and break in a browser environment where require() is not
 * defined.  This plugin replaces each call with a proper ESM import so Vite
 * can bundle everything into the browser-safe output.
 */
function fixCjsRequiresInEsmPlugin(): Plugin {
  // Map of module specifier → ESM import statement to inject
  const CJS_TO_ESM: Array<{ pkg: string; importStatement: string }> = [
    { pkg: 'jscodeshift', importStatement: 'import __jscodeshift__ from "jscodeshift";' },
    { pkg: 'lodash/cloneDeep', importStatement: 'import __cloneDeep__ from "lodash/cloneDeep";' },
    { pkg: 'xml2js', importStatement: 'import * as __xml2js__ from "xml2js";' },
  ]

  // Replacement identifier to use in place of require("pkg")
  const REPLACEMENTS: Record<string, string> = {
    jscodeshift: '__jscodeshift__',
    'lodash/cloneDeep': '__cloneDeep__',
    xml2js: '__xml2js__',
  }

  return {
    name: 'fix-cjs-requires-in-esm',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('@usebruno/converters')) return null

      let transformed = code
      const injectedImports = new Set<string>()

      for (const { pkg, importStatement } of CJS_TO_ESM) {
        const replacement = REPLACEMENTS[pkg]
        // Match both single- and double-quoted variants
        const pattern = new RegExp(`require\\(["']${pkg.replace('/', '\\/')}["']\\)`, 'g')
        if (pattern.test(transformed)) {
          injectedImports.add(importStatement)
          transformed = transformed.replace(pattern, replacement)
        }
      }

      if (injectedImports.size === 0) return null

      return [...injectedImports].join('\n') + '\n' + transformed
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    nodePolyfills({
      // assert: used by jscodeshift's Collection module
      // constants: used by flow-parser (jscodeshift dep)
      // os: used by recast (jscodeshift dep) with an isBrowser() guard but polyfilled for safety
      // timers: used by xml2js for setImmediate
      include: ['assert', 'buffer', 'constants', 'events', 'os', 'process', 'stream', 'timers', 'util'],
      globals: { Buffer: true, process: true, global: true },
    }),
    fixCjsRequiresInEsmPlugin(),
  ],
  optimizeDeps: {
    include: [
      '@usebruno/converters',
      'jscodeshift',
      'lodash/cloneDeep',
      'xml2js',
    ],
  },
  resolve: {
    alias: {
      'graceful-fs': 'node:fs',
    },
  },
})
