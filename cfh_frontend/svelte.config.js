import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter()
	},

	preprocess: [vitePreprocess({})]
};
