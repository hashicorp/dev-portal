/**
 * Note: lines of code are expected to be stable. If we need to work with
 * dynamic code blocks in the future, we could assign random unique IDs
 * to each line during the `linesOfCode` `useMemo` function.
 *
 * For now, we disable react/no-array-index key for the entire file.
 */
/* eslint-disable react/no-array-index-key */

import { useMemo, type ReactNode } from 'react'
import classNames from 'classnames'
import parseHighlightedLines from '../utils/parse-highlighted-lines'
import splitJsxIntoLines from './utils/split-jsx-into-lines'
import splitHtmlIntoLines from './utils/split-html-into-lines'
import s from '../code-block.module.scss'

interface CodeLinesProps {
	value: ReactNode
	hasLineNumbers?: boolean
	highlightLines?: string
}

/**
 * Render the provided code into separate line elements,
 * accounting for all provided options.
 */
const CodeLines = ({
	value,
	hasLineNumbers: lineNumbers,
	highlightLines: highlight,
}: CodeLinesProps) => {
	// Parse out an array of integers representing which lines to highlight
	const highlightedLines = parseHighlightedLines(highlight) as number[]

	/**
	 * Split the incoming code into lines.
	 * We need to do this in order to render each line of code in a
	 * separate element, which is necessary for features such as highlighting
	 * specific lines and allowing code to wrap.
	 */
	const linesOfCode = useMemo(() => {
		const isHtmlString = typeof value === 'string'
		const lineElements = isHtmlString
			? splitHtmlIntoLines(value)
			: splitJsxIntoLines(value)
		return lineElements
			.map((children, index) => {
				const number = index + 1
				const highlight = highlightedLines.indexOf(number) !== -1
				return { children, highlight }
			})
			.map(({ highlight, ...rest }, index, lines) => {
				// Add properties to help with highlighting adjacent lines of code,
				// in which case we want to apply a border to the first and last lines,
				// but not the lines in the middle of the group.
				const prevLine = index === 0 ? null : lines[index - 1]
				const nextLine = index === lines.length - 1 ? null : lines[index + 1]
				return {
					...rest,
					highlight,
					highlightIsFirstInGroup: !prevLine || !prevLine.highlight,
					highlightIsLastInGroup: !nextLine || !nextLine.highlight,
				}
			})
	}, [value, highlightedLines])

	/**
	 * For overflowing code, we use a two-column layout.
	 * The first column contains line numbers, and is effectively fixed.
	 * The second column contains the lines themselves, and is an overflow
	 * container to allow extra long lines to scroll as needed.
	 */
	return (
		<>
			{lineNumbers ? (
				<span aria-hidden="true" className={s['line-numbers-rows']}>
					{linesOfCode.map((line, idx) => (
						<span
							key={idx}
							className={classNames(s['line-number'], {
								[s['line-highlight']]: line.highlight,
								[s['line-highlight-first']]: line.highlightIsFirstInGroup,
								[s['line-highlight-last']]: line.highlightIsLastInGroup,
							})}
						/>
					))}
				</span>
			) : null}
			<span>
				{linesOfCode.map((line, idx) => (
					<span
						key={idx}
						className={classNames(s['line-of-code'], {
							[s['line-highlight']]: line.highlight,
							[s['line-highlight-first']]: line.highlightIsFirstInGroup,
							[s['line-highlight-last']]: line.highlightIsLastInGroup,
						})}
					>
						{line.children}
						{/* We are _not_ rendering our lines as block elements, so we need
						    to add a trailing newline to all lines. As well, trailing
								newlines are necessary for some browsers (FireFox)
						    to preserve whitespace during select-and-copy of code */}
						{'\n'}
					</span>
				))}
			</span>
		</>
	)
}

export { CodeLines }
