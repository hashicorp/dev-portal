/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// imports
const stylelint = require('stylelint')
const { report, ruleMessages, validateOptions } = stylelint.utils
const isBoolean = require('./lib/is-boolean')
const isString = require('./lib/is-string')

const transformMap = {
	'4px': '--hdsplus-spacing-01', // 0.25rem
	'6px': '--hdsplus-spacing-02', // 0.375rem
	'8px': '--hdsplus-spacing-03', // 0.5rem
	'12px': '--hdsplus-spacing-04', // 0.75rem
	'16px': '--hdsplus-spacing-05', // 1rem
	'20px': '--hdsplus-spacing-06', // 1.25rem
	'24px': '--hdsplus-spacing-07', // 1.5rem
	'32px': '--hdsplus-spacing-08', // 2rem
	'40px': '--hdsplus-spacing-09', // 2.5rem
	'48px': '--hdsplus-spacing-10', // 3rem
	'56px': '--hdsplus-spacing-11', // 3.5rem
	'64px': '--hdsplus-spacing-12', // 4rem
	'72px': '--hdsplus-spacing-13', // 4.5rem
	'88px': '--hdsplus-spacing-14', // 5.5rem
	'96px': '--hdsplus-spacing-15', // 6rem
	'128px': '--hdsplus-spacing-16', // 8rem
	'144px': '--hdsplus-spacing-17', // 8.5rem
	'160px': '--hdsplus-spacing-18', // 10rem
}

const transformMapKeys = Object.keys(transformMap)

// meta
const ruleName = 'digital-plugin/no-magic-nums'
const messages = ruleMessages(ruleName, {
	undeclared: (variableName) => {
		return `"${variableName}" was not found in provided \`tokensSource\``
	},
})

const plugin = stylelint.createPlugin(
	ruleName,
	function ruleFunction(primaryOption, secondaryOption, context) {
		return function lint(postcssRoot, postcssResult) {
			// Don't lint if the rule isn't enabled
			if (primaryOption !== true) {
				return
			}

			// Check if the options are valid
			const hasValidOptions = validateOptions(
				postcssResult,
				ruleName,
				{
					actual: primaryOption,
					possible: isBoolean,
					optional: false,
				},
				{
					actual: secondaryOption,
					possible: {
						tokensSource: isString,
					},
					optional: false,
				}
			)

			// Don't lint if the options aren't valid
			if (!hasValidOptions) {
				return null
			}

			// Traverse descendant nodes
			// https://postcss.org/api/#atrule-walkdecls
			postcssRoot.walkDecls((decl) => {
				console.log({ context })

				if (transformMapKeys.includes(decl.value)) {
					// value.value = `var(${transformMap[value.value]})`

					// if (context.fix) {
					// Apply fixes using PostCSS API
					// decl.value = `var(${transformMap[decl.value]})`
					// return // Return and don't report a problem
					// }

					report({
						ruleName,
						result: postcssResult,
						message: `please use var(${transformMap[decl.value]})`,
						node: decl,
					})
				}

				// decl.value.forEach((value) => {
				// 	console.log('cssrule', value)
				// 	console.log(secondaryOption.tokensSource)
				// 	// if (value.type === 'word' && transformMapKeys.includes(value.value)) {
				// 	// 	value.value = `var(${transformMap[value.value]})`
				// 	// }
				// })

				// // Only look at nodes with a value containing a token reference
				// const matches = decl.value.matchAll(/var\((--token-color-.*)\)/g)
				// Array.from(matches, (match) => {
				// 	const tokenName = match[1]
				// 	const isUndefined =
				// 		secondaryOption.tokensSource.indexOf(tokenName) === -1

				// 	// Report an error if the token declaration isn't found
				// 	// https://stylelint.io/developer-guide/plugins/#stylelintutilsreport
				// 	if (isUndefined) {
				// 		report({
				// 			ruleName,
				// 			result: postcssResult,
				// 			message: messages.undeclared(tokenName),
				// 			node: decl,
				// 			word: tokenName,
				// 		})
				// 	}
				// })
			})
		}
	}
)

// exports
module.exports = plugin
module.exports.ruleName = ruleName
module.exports.messages = messages
