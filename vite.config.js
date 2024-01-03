// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				nested: resolve(__dirname, "pages/cart/index.html"),
				nested2: resolve(__dirname, "pages/item/index.html"),
				nested3: resolve(__dirname, "pages/category/index.html"),
				nested4: resolve(__dirname, "pages/favorite/index.html"),
			},
		},
	},
});
