import { unstable_reactRouterRSC as reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import rsc from '@vitejs/plugin-rsc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // use any of react plugins https://github.com/vitejs/vite-plugin-react
    // to enable client component HMR
    reactRouter(),

    rsc({
      // `entries` option is only a shorthand for specifying each `rollupOptions.input` below
      // > entries: { rsc, ssr, client },
      //
      // by default, the plugin setup request handler based on `default export` of `rsc` environment `rollupOptions.input.index`.
      // This can be disabled when setting up own server handler e.g. `@cloudflare/vite-plugin`.
      // > serverHandler: false
    }),

    // use https://github.com/antfu-collective/vite-plugin-inspect
    // to understand internal transforms required for RSC.
    // import("vite-plugin-inspect").then(m => m.default()),

    // use any of css framework plugins, e.g. tailwindcss, to process css imported in server components.
    tailwindcss(),
  ],

  resolve: {
    tsconfigPaths: true,
  },
})
