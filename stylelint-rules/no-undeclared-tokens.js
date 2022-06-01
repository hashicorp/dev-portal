const fs = require('fs')
const stylelint = require('stylelint')
const { report, ruleMessages, validateOptions } = stylelint.utils

const tokensFileName =
  '@hashicorp/design-system-tokens/dist/devdot/css/tokens.css'
const tokensFile = require.resolve(tokensFileName)
const tokensFileContent = fs.readFileSync(tokensFile).toString()

const ruleName = 'digital-plugin/no-undeclared-tokens'
const messages = ruleMessages(ruleName, {
  undeclared: (undeclared) =>
    `"${undeclared}" was not found in ${tokensFileName}`,
})

module.exports.ruleName = ruleName
module.exports.messages = messages
module.exports = stylelint.createPlugin(
  ruleName,
  function ruleFunction(primaryOption) {
    return function lint(postcssRoot, postcssResult) {
      // Don't lint if the rule isn't enabled
      if (primaryOption !== true) {
        return
      }

      // Check if the options are valid
      const hasValidOptions = validateOptions(postcssResult, ruleName, {
        //No options for now...
      })

      // Don't lint if the options aren't valid
      if (!hasValidOptions) {
        return null
      }

      // Traverse descendant nodes
      // https://postcss.org/api/#atrule-walkdecls
      postcssRoot.walkDecls((decl) => {
        // Only look at nodes with a value starting with a token reference
        if (decl.value.startsWith('var(--token-color')) {
          // Slice out the name of the token
          const token = decl.value.slice('var('.length, -1)

          // Report an error if the token declaration isn't found
          // https://stylelint.io/developer-guide/plugins/#stylelintutilsreport
          if (tokensFileContent.indexOf(token) === -1) {
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
