/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Config } from '@jest/types'
import makeConfig from '@hashicorp/platform-configs/jest/config.js'

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
	moduleNameMapper: {
		'^@scripts/(.*)$': '../../../scripts/$1',
	},
}

export default makeConfig({ nextDir: './', ...config })
