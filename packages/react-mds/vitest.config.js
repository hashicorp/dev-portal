import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: [...configDefaults.exclude, 'src/__tests__/e2e'],
		setupFiles: ['.test/setup-vitest.js'],
	},
})
