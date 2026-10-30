import { defineConfig } from "astro/config"
import react from "@astrojs/react"

export default defineConfig({
  site: "https://www.konraddierks.eu",
  publicDir: "./static",
  integrations: [react()],
  vite: {
    build: {
      // Plotly is a lazily loaded chunk of about 1.1 MB
      chunkSizeWarningLimit: 1200,
    },
  },
})
