import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The Cloudflare Vite plugin runs the Worker (API + agent) and the React frontend together,
// both in `vite dev` and in the production build.
export default defineConfig({
	plugins: [react(), cloudflare()],
});
