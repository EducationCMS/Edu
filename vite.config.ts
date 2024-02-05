import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"
// import htmlPurge from "vite-plugin-purgecss"

export default defineConfig({
  // @ts-ignore
  // htmlPurge(), mkcert()
  plugins: [vue({
    script: {
      defineModel: true
      // propsDestructure: true
    }
  }), svgLoader()],
  // server: {
  //   https: true
  // },
  resolve: {
    extensions: ["*", ".js", ".ts", ".vue", ".json"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
