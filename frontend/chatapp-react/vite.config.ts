import path from "path";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }):UserConfig => {
   const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
     base: env.VITE_BASE_PATH || "/chatapp-react", 
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});