const { node, browser } = require('globals')
const pluginJs = require('@eslint/js')
const tseslint = require('typescript-eslint')
const pluginReact = require('eslint-plugin-react')
const noBarrelFiles = require('eslint-plugin-no-barrel-files')

module.exports = [
	{
		ignores: [
			'.next',
			'**/dist',
			'eslint.config.js',
			'public',
			'vitest.config.mts',
			'playwright-report',
		],
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		settings: { react: { version: 'detect' } },
	},
	{ 
		files: ['**/*.{js,ts,jsx,tsx}'],
		languageOptions: { globals: { ...node, ...browser } },
		plugins: { 'no-barrel-files': noBarrelFiles },
		rules: {
			// TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
			'default-case': 'off',
			// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
			'no-dupe-class-members': 'off',
			// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
			'no-undef': 'off',
			// Add TypeScript specific rules (and turn off ESLint equivalents)
			// '@typescript-eslint/no-angle-bracket-type-assertion': 'warn',
			'no-array-constructor': 'off',
			'@typescript-eslint/no-array-constructor': 'warn',
			'@typescript-eslint/no-namespace': 'error',
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': [
				'warn',
				{
					functions: false,
					classes: false,
					variables: false,
					typedefs: false
				}
			],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'none',
					ignoreRestSiblings: true
				}
			],
			'no-useless-constructor': 'off',
			'@typescript-eslint/no-useless-constructor': 'warn',
			// This is really verbose, and requires the author to add a lot of
			// types that are already inferred by Typescript (so you'll see them in
			// an IDE like VSCode just fine). We may want it eventually, but I
			// suspect it will slow people down when doing page conversions. Note
			// that `tslint:recommended` turns this kind of checking off.
			'@typescript-eslint/explicit-function-return-type': 'off',
			
			// Not necessary in Next.js (https://spectrum.chat/next-js/general/react-must-be-in-scope-when-using-jsx~6193ef62-4d5e-4681-8f51-8c7bf6b9d56d)
            'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['**/*.js?(x)'],
		rules: {
			// For instances where we aren't using esmodules or TypeScript and therefore can't use import
			'@typescript-eslint/no-require-imports': 'off'
		},
	},
	{
		files: ['**/*.ts?(x)'],
		rules: {
            'react/prop-types': 'off',
            'react/no-array-index-key': 'warn',
            'react/no-unknown-property': ['error', { ignore: ['class'] }]
		},
	},
]

