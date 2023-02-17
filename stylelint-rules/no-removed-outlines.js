/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// imports
const stylelint = require('stylelint')
const { report, ruleMessages, validateOptions } = stylelint.utils

// meta
const ruleName = 'digital-plugin/no-removed-outlines'
const messages = ruleMessages(ruleName, {
	error:
		'Do not remove outlines. Set them to be transparent instead. Removing outlines makes focus indicators inaccessible in high contrast modes.',
})

const plugin = stylelint.createPlugin(
	ruleName,
	function ruleFunction(primaryOption) {
		return function lint(postcssRoot, postcssResult) {
			// Don't lint if the rule isn't enabled
			if (primaryOption !== true) {
				return
			}

			// Check if the options are valid
			const hasValidOptions = validateOptions(postcssResult, ruleName, {
				// No options for now...
			})

			// Don't lint if the options aren't valid
			if (!hasValidOptions) {
				return null
			}

			/**
			 * Traverse descendant nodes that specify the `outline`, `outline-width`,
			 * or `outline-style` properties.
			 *
			 * ref: https://postcss.org/api/#atrule-walkdecls
			 */
			postcssRoot.walkDecls(
				/^(outline|outline-style|outline-width)$/,
				(decl) => {
					const { prop, value } = decl

					// Split for `outline`, which can have many parts.
					const valueParts = value.split(' ')

					// Check for an invalid part in `value`
					const invalidPart = valueParts.find(
						(valuePart) => valuePart === 'none' || valuePart === '0'
					)
					if (invalidPart) {
						report({
							ruleName,
							result: postcssResult,
							message: messages.error,
							node: decl,
							word: prop,
						})
					}
				}
			)
		}
	}
)

// exports
module.exports = plugin
module.exports.ruleName = ruleName
module.exports.messages = messages
