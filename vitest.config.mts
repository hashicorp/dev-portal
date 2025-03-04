import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: [...configDefaults.exclude, '.next', 'src/__tests__/e2e', 'src/.extracted'],
		setupFiles: ['dotenv/config', '.test/setup-vitest.js'],
	},
})
