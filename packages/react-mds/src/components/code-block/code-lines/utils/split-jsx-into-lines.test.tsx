import splitJsxIntoLines from './split-jsx-into-lines'
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

it('splits into lines at newline children', () => {
	const jsxInput = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		'\n',
		<span key="1">{`alert("Another line");`}</span>,
	]
	const expectedResult = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		<span key="1">{`alert("Another line");`}</span>,
	]
	// Compare result and expected result via static markup
	const result = splitJsxIntoLines(jsxInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})

it('groups consecutive non-newline elements', () => {
	const jsxInput = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		'\n',
		<span key="1">{`alert(`}</span>,
		<span key="2">{`"Third token on the same line as the second"`}</span>,
		<span key="3">{`);`}</span>,
	]
	const expectedResult = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		[
			<span key="1">{`alert(`}</span>,
			<span key="2">{`"Third token on the same line as the second"`}</span>,
			<span key="3">{`);`}</span>,
		],
	]
	// Compare result and expected result via static markup
	const result = splitJsxIntoLines(jsxInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})

it('inserts blank lines when consecutive newlines are present', () => {
	const jsxInput = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		'\n',
		'\n',
		<span key="1">{`alert(`}</span>,
		<span key="2">{`"Third token on the same line as the second"`}</span>,
		<span key="3">{`);`}</span>,
	]
	const expectedResult = [
		<span key="0">{`console.log("Hello world!");`}</span>,
		'',
		[
			<span key="1">{`alert(`}</span>,
			<span key="2">{`"Third token on the same line as the second"`}</span>,
			<span key="3">{`);`}</span>,
		],
	]
	// Compare result and expected result via static markup
	const result = splitJsxIntoLines(jsxInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})

it('handles cases that start or end with newlines', () => {
	const jsxInput = [
		'\n',
		<span key="0" className="eg-token">{`console.log("Hello world!");`}</span>,
		'\n',
		<span key="1" className="eg-token">{`alert("Another line");`}</span>,
		'\n',
	]
	const expectedResult = [
		'',
		<span key="0" className="eg-token">{`console.log("Hello world!");`}</span>,
		<span key="1" className="eg-token">{`alert("Another line");`}</span>,
	]
	// Compare result and expected result via static markup
	const result = splitJsxIntoLines(jsxInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})

it('handles cases that start or end with multiple newlines', () => {
	const jsxInput = [
		'\n',
		'\n',
		<span key="0" className="eg-token">{`console.log("Hello world!");`}</span>,
		'\n',
		<span key="1" className="eg-token">{`alert("Another line");`}</span>,
		'\n',
		'\n',
	]
	const expectedResult = [
		'',
		'',
		<span key="0" className="eg-token">{`console.log("Hello world!");`}</span>,
		<span key="1" className="eg-token">{`alert("Another line");`}</span>,
		'',
	]
	// Compare result and expected result via static markup
	const result = splitJsxIntoLines(jsxInput)
	const resultMarkup = renderLinesToMarkup(result)
	const expectedMarkup = renderLinesToMarkup(expectedResult)
	expect(resultMarkup).toBe(expectedMarkup)
})
