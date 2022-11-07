import { Config } from '@jest/types'

const config: Config.InitialOptions = {
	setupFilesAfterEnv: ['<rootDir>/.test/setup-jest.js'],
	roots: ['config', 'src', 'build-libs', 'stylelint-rules'],
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	moduleDirectories: ['node_modules', 'src'],
	moduleNameMapper: {
		/* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

		// Handle CSS imports (without CSS modules)
		'^.+\\.(css|sass|scss)$': '<rootDir>/.test/__mocks__/styleMock.js',

		// For .svg?include imports, remove the ?include suffix,
		// so that it can be resolved and loaded with jest-raw-loader
		'(.*)\\.svg\\?include$': '$1.svg',

		/* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
		'^.+\\.(jpg|jpeg|png|gif|webp|svg)$':
			'<rootDir>/.test/__mocks__/fileMock.js',

		/* Mock graphql queries & fragments */
		'\\.graphql$': '<rootDir>/.test/__mocks__/graphql-fragment-mock.js',
	},
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/.next/',
		'<rootDir>/src/__tests__/e2e',
	],
	testEnvironment: 'jsdom',
	transform: {
		/* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
		// Load .svg imports as raw strings.
		// Our mapping above means this only targets .svg?include imports.
		'\\.svg$': 'jest-raw-loader',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(@hashicorp/|unist-))',
		'^.+\\.module\\.(css|sass|scss)$',
	],
}

export default config
