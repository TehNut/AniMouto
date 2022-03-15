import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { ManifestV2, ManifestV3 } from "./src/manifest";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const configEnv = loadEnv(mode, process.cwd(), "");

  const manifest = configEnv.MANIFEST_VERSION === "3" ? ManifestV3 : ManifestV2;

  return {
    build: {
      outDir: `dist/${mode}`
    },
    optimizeDeps: {
      exclude: [ "@urql/svelte" ]
    },
    plugins: [
      svelte(),
      webExtension({
        // @ts-ignore Error caused by both v2 and v3 support
        manifest: {
          author: pkg.author,
          description: pkg.description,
          name: pkg.displayName ?? pkg.name,
          version: pkg.version,
          ...manifest,
        },
      }),
    ],
    resolve: {
      alias: {
        "$lib": path.resolve(__dirname, "./src/lib"),
        "$assets": path.resolve(__dirname, "./src/assets"),
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
