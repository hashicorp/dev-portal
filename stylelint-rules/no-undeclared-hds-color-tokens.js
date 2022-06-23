// imports
const stylelint = require('stylelint')
const { report, ruleMessages, validateOptions } = stylelint.utils
const isBoolean = require('./lib/is-boolean')
const isString = require('./lib/is-string')

// meta
const ruleName = 'digital-plugin/no-undeclared-hds-color-tokens'
const messages = ruleMessages(ruleName, {
  undeclared: (variableName) => {
    return `"${variableName}" was not found in provided \`tokensSource\``
  },
})

const plugin = stylelint.createPlugin(
  ruleName,
  function ruleFunction(primaryOption, secondaryOption) {
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
        // Only look at nodes with a value starting with a token reference
        const matches = decl.value.match(/var\(--token-color-.*\)/g)
        const usesHDSColorToken = matches?.length >= 1
        if (usesHDSColorToken) {
          // Slice out the name of the token
          const token = matches[0].slice('var('.length, -1)

          // Report an error if the token declaration isn't found
          // https://stylelint.io/developer-guide/plugins/#stylelintutilsreport
          if (secondaryOption.tokensSource.indexOf(token) === -1) {
            report({
              ruleName,
              result: postcssResult,
              message: messages.undeclared(token),
              node: decl,
              word: token,
            })
          }
        }
      })
    }
  }
)

// exports
module.exports = plugin
module.exports.ruleName = ruleName
module.exports.messages = messages
