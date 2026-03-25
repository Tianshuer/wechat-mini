import { defineConfig } from "vite";
import { resolve } from 'path';
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'legacy-js-api']
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    include: ['vue', '@vue/shared', '@vue/runtime-core'],
    force: true
  }
});
