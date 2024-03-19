import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: [...configDefaults.exclude, 'src/__tests__/e2e'],
		setupFiles: ['dotenv/config', '.test/setup-vitest.js'],
	},
	resolve: {
		alias: {
			components: fileURLToPath(new URL('./src/components', import.meta.url)),
			constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
			content: fileURLToPath(new URL('./src/content', import.meta.url)),
			contexts: fileURLToPath(new URL('./src/contexts', import.meta.url)),
			data: fileURLToPath(new URL('./src/data', import.meta.url)),
			flags: fileURLToPath(new URL('./src/flags', import.meta.url)),
			hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
			layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
			lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
			pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
			styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
			types: fileURLToPath(new URL('./src/types', import.meta.url)),
			views: fileURLToPath(new URL('./src/views', import.meta.url)),
		},
	},
})
