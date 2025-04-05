import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'dark-navy': '#0D0F12',
				'neon-pink': '#FF007F',
				'neon-purple': '#9B59B6',
				'cyan': '#00FFFF',
				'lime-green': '#00FF00',
				'white': '#FFFFFF',
				'light-gray': '#BDC3C7',
				'neon-blue': '#00BFFF',
				'neon-orange': '#FF4500',
			  },
		}
	},

	plugins: []
} satisfies Config;
