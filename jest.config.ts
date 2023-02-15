/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Config } from '@jest/types'
import makeConfig from '@hashicorp/platform-configs/jest/config.js'

const config: Config.InitialOptions = {
	setupFilesAfterEnv: ['<rootDir>/.test/setup-jest.js'],
	roots: ['config', 'src', 'build-libs', 'stylelint-rules'],
	moduleDirectories: ['node_modules', 'src'],
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	testPathIgnorePatterns: ['<rootDir>/src/__tests__/e2e'],
	testEnvironment: 'jsdom',
}

export default makeConfig({ nextDir: './', ...config })
