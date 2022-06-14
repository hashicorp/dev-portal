const DISALLOWED_VARIABLES = ['isMobile', 'isTablet', 'isDesktop']

function checkJSXExpressionContainer(context, node) {
  const variablesInScope = context.getScope().variables

  function isValidExpression(expr) {
    if (expr.type === 'LogicalExpression') {
      return isValidExpression(expr.left) && isValidExpression(expr.right)
    } else if (expr.type === 'ConditionalExpression') {
      return (
        isValidExpression(expr.alternate) &&
        isValidExpression(expr.consequent) &&
        isValidExpression(expr.test)
      )
    } else if (expr.type === 'Identifier') {
      if (DISALLOWED_VARIABLES.indexOf(expr.name) >= 0) {
        return false
      } else {
        let isValid = true
        const matchingVariable = variablesInScope.find(
          (v) => v.name === expr.name
        )
        if (matchingVariable) {
          matchingVariable.defs.forEach((def) => {
            if (def.node.init) {
              isValid = isValid && isValidExpression(def.node.init)
            } else {
              isValid =
                isValid && DISALLOWED_VARIABLES.indexOf(def.node.name) === -1
            }
          })
        }
        return isValid
      }
    }

    return true
  }

  if (!isValidExpression(node.expression)) {
    context.report({
      node,
      message: `Do not conditionally render content using: ${DISALLOWED_VARIABLES.join(
        ', '
      )}. Use a CSS approach instead.`,
    })
  }
}

module.exports = {
  meta: {
    type: 'problem',
    schema: [], // no options
  },
  rules: {
    'no-conditional-rendering-on-device-size': {
      create: function (context) {
        return {
          JSXExpressionContainer(node) {
            checkJSXExpressionContainer(context, node)
          },
        }
      },
    },
  },
}
