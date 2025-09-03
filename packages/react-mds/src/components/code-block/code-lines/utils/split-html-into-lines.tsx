import type { ReactNode } from 'react'

const SHIKI_BLANK_LINE = '<span class="line"></span>'
/**
 * Given a string of HTML, split it on newlines,
 * and return an array of React <span> elements,
 * each of which will contain a single line.
 *
 * Note that HTML tokens should not be multi-line,
 * ie, all newline characters should be surfaced
 * to the top level rather than nested in syntax
 * highlighting tokens (otherwise the line-by-line
 * markup we render would be invalid). We have
 * a rehype plugin we use with our highlightString()
 * utility to ensure newlines are surfaced in this way.
 *
 * @param {string} codeHtml String of HTML
 * @returns Array of JSX <span> elements
 */
function splitHtmlIntoLines(codeHtml: string): (ReactNode | null)[] {
	const lineParts = codeHtml.split('\n')
	return lineParts.map((lineHtml, stableIdx) => {
		// Cut trailing newlines
		const isLastLine = stableIdx == lineParts.length - 1
		const isTrailingNewline = isLastLine && lineHtml == ''
		if (isTrailingNewline) return null
		// Otherwise, render the line
		return (
			<span
				// This array is stable, so we can use index as key
				// eslint-disable-next-line react/no-array-index-key
				key={stableIdx}
				dangerouslySetInnerHTML={{
					__html:
						lineHtml === '' || lineHtml === SHIKI_BLANK_LINE
							? '&nbsp;'
							: lineHtml,
				}}
			/>
		)
	})
}

export default splitHtmlIntoLines
