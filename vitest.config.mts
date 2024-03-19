import { fileURLToPath, URL } from 'node:url'
import { readdirSync } from 'node:fs'
import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import type { AliasOptions } from 'vite'

import { compilerOptions } from './tsconfig.json'

// Generates a list of aliases for the src directory, built from all the
// top-level directories in the src directory. This mimics our tsconfig
// `baseUrl` configuration.
function buildAliases(): AliasOptions {
	const baseUrl = compilerOptions.baseUrl
	const aliases: AliasOptions = {}
	const directories = readdirSync(baseUrl, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)

	for (const directory of directories) {
		aliases[directory] = fileURLToPath(
			new URL(`./${baseUrl}/${directory}`, import.meta.url)
		)
	}

	return aliases
}

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
			...buildAliases(),
		},
	},
})
