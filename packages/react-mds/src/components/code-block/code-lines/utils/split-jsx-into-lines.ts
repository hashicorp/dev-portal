import { Children, type ReactNode } from 'react'

/**
 * Given an array of React children,
 * split the array on newlines, grouping consecutive
 * non-newline tokens in individual line elements,
 * and return an array of React <span> elements,
 * each of which will contain a single line.
 *
 * Note that JSX tokens should not be multi-line,
 * ie, all newline characters should be surfaced
 * to the top level rather than nested in syntax
 * highlighting tokens (otherwise the line-by-line
 * markup we render would be invalid). We have
 * a rehype plugin we include with our markdown defaults
 * to ensure newlines are surfaced in this way.
 *
 * @param {*} codeJsx Array of JSX elements, some of which may be newline strings
 * @returns Array of JSX <span> elements representing individual lines
 */
function splitJsxIntoLines(codeJsx: React.ReactNode | React.ReactNode[]) {
	const linesArray = Children.toArray(codeJsx)
	/**
	 * Many newlines take the form of a literal newline string, `\n`.
	 * However, some newlines take different forms. We expect these to be tagged
	 * with an `empty-line` className by our rehype code plugins.
	 * Here we detect the latter types of newline, and convert them to the former.
	 */
	const withNormalizedNewlines = linesArray.map((token) => {
		// If our token has an `empty-line` className, use a literal newline
		// rather than the token itself (which would render, but with zero height)
		if (typeof token === 'object' && 'props' in token) {
			if (token.props.className?.includes('empty-line')) {
				return '\n'
			}
		}
		// Otherwise, return the token unmodified
		return token
	})
	// Filter out any surfaces newlines, that are "in between"
	// other lines of code. Special exceptions should be made for:
	// 1. newlines at start or end of array - should be rendered as blank lines
	// 2. consecutive newlines - "n" consecutive newlines should be rendered
	//    as "n - 1" blank lines.
	const accumulatedLines = withNormalizedNewlines.reduce(
		(acc, token, idx) => {
			const isLastLine = idx === withNormalizedNewlines.length - 1
			const isNewline = token === '\n'
			const isInlineToken = token !== '\n'
			// For newlines, increment the consecutive newline counter
			if (isNewline) acc.consecutiveNewlines++
			// If this token is an inline token, and we have
			// pending newlines, then start a new line,
			// adding blank lines for consecutive newlines as needed
			const isFinalNewline = isNewline && isLastLine
			const hasNewlines = acc.consecutiveNewlines > 0
			const needsNewlines = (isInlineToken || isFinalNewline) && hasNewlines
			if (needsNewlines) {
				// If there are any tokens in the current line, add them as a new line
				if (acc.currentLine.length > 0) {
					acc.lines.push(acc.currentLine)
					acc.currentLine = []
				}
				// Add blank lines for each consecutive newline, then reset the counter
				for (let i = 1; i < acc.consecutiveNewlines; i++) {
					acc.lines.push('')
				}
				acc.consecutiveNewlines = 0
			}
			// If this token is an inline token,
			// append it to the current line
			if (isInlineToken) {
				acc.currentLine.push(token)
				// If this is the last line,
				// then ensure the current line
				// has been pushed to the lines array
				if (isLastLine) acc.lines.push(acc.currentLine)
			}
			return acc
		},
		{
			lines: [] as ReactNode[],
			currentLine: [] as ReactNode[],
			consecutiveNewlines: 1, // Start at 1 to handle leading newlines
		}
	)
	return accumulatedLines.lines
}

export default splitJsxIntoLines
