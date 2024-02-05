/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Config } from '@jest/types'

import makeConfig from '@hashicorp/platform-configs/jest/config.js'
import { compilerOptions } from './tsconfig.json'

const tsPathsToModuleNameMapper = (
	mapping: { [key: string]: string[] },
	baseUrl
) => {
	const jestMap = {}
	for (const [fromPath, paths] of Object.entries(mapping)) {
		// we assume only one path, which I feel like is 99% the correct assumption
		if (mapping[fromPath].length > 1) {
			throw new Error(
				`\n\n⚠️  Current typescript to jest path aliasing is limited to one path per alias.  ⚠️\n\nOffending ts path aliases:\n- [${fromPath}]: [${paths.join(
					','
				)}]\n`
			)
		}

		const toPath = paths[0]

		// '@scripts/*' -> '^@scripts/(.*)$'
		const jestFromPath = `^${fromPath.replace('*', '(.*)$')}`

		let jestToPath
		if (toPath.includes('../')) {
			// ['../src/*'] -> "<rootDir>/src/$1"
			jestToPath = `<rootDir>/${toPath.replace('../', '').replace('*', '$1')}`
		} else {
			// ['./src/*'] -> "<rootDir>/${baseUrl}/src/$1"
			jestToPath = `<rootDir>/${baseUrl}/${toPath.replace('*', '$1')}`
		}

		jestMap[jestFromPath] = jestToPath
	}

	return jestMap
}

/**
 * We use a dynamic jest config in order to be able to run both
 * ESM and CommonJS tests using the same config, with separate test commands.
 *
 * This approach was taken from `@hashicorp/web-platform-packages`.
 */
const isRunningInEsmMode = !!process.env.TEST_ESM

/**
 * These tests are authored using native ESModules,
 * and so we want to configure jest differently to handle that.
 *
 * TODO: determine this from "type": "module" in package.json
 */
const ESM_TEST_DIRS = [
	'src/lib/remark-plugins/rehype-sanitize',
	'src/views/open-api-docs-view/utils',
]

/**
 * Override the base next jest-transformer to force it into ESM mode
 */
const esmConfig: Config.InitialOptions = {
	setupFilesAfterEnv: [],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transform: {
		'^.+\\.(js|jsx|ts|tsx|mjs)$': [
			require.resolve('next/dist/build/swc/jest-transformer.js'),
			{
				isEsmProject: true,
			},
		],
	},
}

/**
 * Exclude ESM-native packages from running when not in ESM mode
 */
const ignorePatternForModuleType = isRunningInEsmMode
	? `<rootDir>/(?!${ESM_TEST_DIRS.join('|')}).*/.*`
	: `<rootDir>/(${ESM_TEST_DIRS.join('|')})/.*`

/**
 * Build the final config.
 *
 * Note that when `isRunningInEsmMode`, options may be overridden
 * when spreading `...esmConfig`.
 */
const config: Config.InitialOptions = {
	setupFilesAfterEnv: ['<rootDir>/.test/setup-jest.js'],
	roots: ['config', 'src', 'build-libs', 'stylelint-rules'],
	moduleDirectories: ['node_modules', '<rootDir>/src'],
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	testPathIgnorePatterns: [
		ignorePatternForModuleType,
		'<rootDir>/src/__tests__/e2e',
	],
	testEnvironment: 'jsdom',
	...(isRunningInEsmMode && esmConfig),
	moduleNameMapper: tsPathsToModuleNameMapper(
		compilerOptions.paths,
		compilerOptions.baseUrl
	),
}

export default makeConfig({ nextDir: './', ...config })
