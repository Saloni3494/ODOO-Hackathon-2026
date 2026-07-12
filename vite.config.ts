// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
    // @ts-ignore
    rollupConfig: {
      output: {
        inlineDynamicImports: true
      }
    }
  },
  vite: {
    server: {
      allowedHosts: true,
    },
    build: {
      minify: false,
    },
    ssr: {
      external: ['@floating-ui/react-dom', '@floating-ui/react', '@floating-ui/dom', '@floating-ui/core']
    }
  }
});
