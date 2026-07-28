import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: "sileo-v2/styles.css",
				replacement: resolve(__dirname, "../src/styles.css"),
			},
			{
				find: "sileo-v2",
				replacement: resolve(__dirname, "../src/index.ts"),
			},
		],
	},
});
