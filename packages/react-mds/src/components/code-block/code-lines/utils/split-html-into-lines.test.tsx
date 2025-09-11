import splitHtmlIntoLines from './split-html-into-lines'
import ReactDOMServer from 'react-dom/server'
import type { ReactNode } from 'react'

function renderLinesToMarkup(linesArray: ReactNode[]) {
	const linesJsx = linesArray.map((line, idx) => {
		return (
			// idx is stable, safer to use as key than the
			// line contents, which are often identical (eg blank lines)
			// eslint-disable-next-line react/no-array-index-key
			<div key={idx} className="line">
				{line}
			</div>
		)
	})
	return ReactDOMServer.renderToStaticMarkup(linesJsx as any)
}

it('splits prism HTML into lines', () => {
	const htmlInput = `<span>package</span> main\n\n<span>import</span> <span>"fmt"</span>\n\n<span>func</span> <span>main</span><span>(</span><span>)</span> <span>{</span>`
	const expectedResult = [
		<span
			key="0"
			dangerouslySetInnerHTML={{
				__html: '<span>package</span> main',
			}}
		/>,
		<span
			key="1"
			dangerouslySetInnerHTML={{
				__html: '&nbsp;',
			}}
		/>,
		<span
			key="2"
			dangerouslySetInnerHTML={{
				__html: '<span>import</span> <span>"fmt"</span>',
			}}
		/>,
		<span
			key="3"
			dangerouslySetInnerHTML={{
				__html: '&nbsp;',
			}}
		/>,
		<span
			key="4"
			dangerouslySetInnerHTML={{
				__html:
					'<span>func</span> <span>main</span><span>(</span><span>)</span> <span>{</span>',
			}}
		/>,
	]
	// Compare result and expected result via static markup
	const result = splitHtmlIntoLines(htmlInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})

it('splits shiki HTML into lines', () => {
	const htmlInput = `<span class="line"><span>mock_provider</span><span> "aws"</span><span> {}</span></span>
<span class="line"></span>
<span class="line"><span>run</span><span> "sets_correct_name"</span><span> {</span></span>`
	const expectedResult = [
		<span
			key="0"
			dangerouslySetInnerHTML={{
				__html:
					'<span class="line"><span>mock_provider</span><span> "aws"</span><span> {}</span></span>',
			}}
		/>,
		<span
			key="1"
			dangerouslySetInnerHTML={{
				__html: '&nbsp;',
			}}
		/>,
		<span
			key="2"
			dangerouslySetInnerHTML={{
				__html:
					'<span class="line"><span>run</span><span> "sets_correct_name"</span><span> {</span></span>',
			}}
		/>,
	]
	// Compare result and expected result via static markup
	const result = splitHtmlIntoLines(htmlInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})
