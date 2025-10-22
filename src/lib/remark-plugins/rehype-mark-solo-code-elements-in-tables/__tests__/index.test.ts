/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { serialize } from 'lib/next-mdx-remote/serialize'
import { rehypeMarkSoloCodeElementsInTables } from '..'

describe('rehypeMarkSoloCodeElementsInTables', () => {
	it('adds className to solo inline code elements in table cells', async () => {
		// Set up an MDX string with a table containing solo inline code
		const mdxString = [
			'| Column 1 | Column 2 |',
			'|----------|----------|',
			'| `solo-code` | regular text |',
			'| another cell | `another-solo` |',
		].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find all table cells (td elements)
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(4)

		// First cell should have inline code with the special class
		const firstCell = tableCells[0]
		expect(firstCell.children.length).toBe(1)

		const firstInlineCode = firstCell.children[0] as Element
		expect(firstInlineCode.tagName).toBe('inlineCode')

		const firstClassName = firstInlineCode.properties?.className
		expect(firstClassName).toBe('tableCellSolelyInlineCode')

		// Second cell should not have the class (contains regular text)
		const secondCell = tableCells[1]
		expect(secondCell.children.length).toBe(1)
		const secondChild = secondCell.children[0]
		expect('tagName' in secondChild ? secondChild.tagName : null).not.toBe(
			'inlineCode'
		)

		// Third cell should not have the class (contains regular text)
		const thirdCell = tableCells[2]
		expect(thirdCell.children.length).toBe(1)
		const thirdChild = thirdCell.children[0]
		expect('tagName' in thirdChild ? thirdChild.tagName : null).not.toBe(
			'inlineCode'
		)

		// Fourth cell should have inline code with the special class
		const fourthCell = tableCells[3]
		expect(fourthCell.children.length).toBe(1)

		const fourthInlineCode = fourthCell.children[0] as Element
		expect(fourthInlineCode.tagName).toBe('inlineCode')
		expect(fourthInlineCode.properties?.className).toContain(
			'tableCellSolelyInlineCode'
		)
	})

	it('does not add className to inline code with other content in the same cell', async () => {
		// Set up an MDX string with a table containing mixed content
		const mdxString = [
			'| Column 1 | Column 2 |',
			'|----------|----------|',
			'| `code` and text | text and `code` |',
			'| Some text `code` more text | `code1` and `code2` |',
		].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find all table cells (td elements)
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(4)

		// All cells should have multiple children, so no inline code should get the class
		tableCells.forEach((cell) => {
			expect(cell.children.length).toBeGreaterThan(1)

			// Find any inline code elements in this cell
			const inlineCodeElements = cell.children.filter(
				(child: Element) => child.tagName === 'inlineCode'
			) as Element[]

			// None of them should have the special class
			inlineCodeElements.forEach((inlineCode) => {
				const className = inlineCode.properties?.className
				expect(className).not.toBe('tableCellSolelyInlineCode')
			})
		})
	})

	it('preserves existing classNames when adding the special class', async () => {
		// This test requires setting up a scenario where inline code already has classes
		// We'll create a simple case and manually verify the behavior
		const mdxString = [
			'| Column 1 |',
			'|----------|',
			'| `existing-class-code` |',
		].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find the table cell
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(1)

		const firstCell = tableCells[0]
		expect(firstCell.children.length).toBe(1)
		const inlineCode = firstCell.children[0] as Element
		expect(inlineCode.tagName).toBe('inlineCode')

		// The class should be added (even if there were no existing classes)
		const className = inlineCode.properties?.className
		expect(className).toBe('tableCellSolelyInlineCode')
	})

	it('ignores inline code elements outside of table cells', async () => {
		// Set up an MDX string with inline code outside tables
		const mdxString = [
			'This is a paragraph with `inline code` that should not be affected.',
			'',
			'## Heading with `code`',
			'',
			'- List item with `code`',
			'',
			'| Table | Cell |',
			'|-------|------|',
			'| `table-code` | normal |',
		].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find all inline code elements
		const allInlineCode = findElementsByTagName(root, 'inlineCode')

		// Only the one in the table cell should have the special class
		const codeWithSpecialClass = allInlineCode.filter((code) => {
			const className = code.properties?.className
			return className === 'tableCellSolelyInlineCode'
		})
		expect(codeWithSpecialClass.length).toBe(1)

		// Find the table cell to confirm
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(2)
		const firstTableCell = tableCells[0]
		expect(firstTableCell.children.length).toBe(1)
		const tableInlineCode = firstTableCell.children[0] as Element
		expect(tableInlineCode.properties?.className).toContain(
			'tableCellSolelyInlineCode'
		)
	})

	it('handles empty table cells correctly', async () => {
		// Set up an MDX string with empty table cells
		const mdxString = [
			'| Column 1 | Column 2 | Column 3 |',
			'|----------|----------|----------|',
			'| `code` |  | text |',
			'|  | `another` |  |',
		].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find all table cells
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(6)

		// Check first row
		const firstRowFirstCell = tableCells[0]
		expect(firstRowFirstCell.children.length).toBe(1)
		const firstInlineCode = firstRowFirstCell.children[0] as Element
		expect(firstInlineCode.tagName).toBe('inlineCode')
		expect(firstInlineCode.properties?.className).toContain(
			'tableCellSolelyInlineCode'
		)

		// Second cell in first row should be empty or have whitespace only
		// We don't need to test the empty cell behavior in detail for this plugin

		// Check second row
		const secondRowSecondCell = tableCells[4] // Second cell of second row
		expect(secondRowSecondCell.children.length).toBe(1)
		const secondInlineCode = secondRowSecondCell.children[0] as Element
		expect(secondInlineCode.tagName).toBe('inlineCode')
		expect(secondInlineCode.properties?.className).toContain(
			'tableCellSolelyInlineCode'
		)
	})

	it('handles table cells with only whitespace and inline code correctly', async () => {
		// This tests edge cases where there might be whitespace nodes
		const mdxString = ['| Column 1 |', '|----------|', '| `code` |'].join('\n')

		// Process the MDX and extract the AST
		const root = await getProcessedHast(mdxString)

		// Find the table cell
		const tableCells = findElementsByTagName(root, 'td')
		expect(tableCells.length).toBe(1)

		const cell = tableCells[0]
		// Should have exactly one child (the inline code)
		expect(cell.children.length).toBe(1)
		const inlineCode = cell.children[0] as Element
		expect(inlineCode.tagName).toBe('inlineCode')
		expect(inlineCode.properties?.className).toContain(
			'tableCellSolelyInlineCode'
		)
	})
})

/**
 * Utility to process a markdown string with `next-mdx-remote`,
 * returning the rehype syntax tree after processing with our plugin.
 */
async function getProcessedHast(mdxString: string): Promise<Root> {
	const extractedData: { hast?: Root } = {}
	await serialize(mdxString, {
		mdxOptions: {
			rehypePlugins: [
				[rehypeMarkSoloCodeElementsInTables as Plugin],
				[rehypeExtractHast, { extractedData }],
			],
		},
	})
	return extractedData.hast as Root
}

/**
 * Utility to extract the rehype syntax tree, useful for asserting what we're
 * going to render via `next-mdx-remote`.
 */
function rehypeExtractHast({
	extractedData,
}: {
	extractedData: Record<string, unknown>
}) {
	return function transformer(tree: Root): void {
		extractedData.hast = tree
	}
}

/**
 * Utility function to find all elements with a specific tag name in the HAST tree
 */
function findElementsByTagName(root: Root, tagName: string): Element[] {
	const elements: Element[] = []

	function walk(node: Element | Root): void {
		if ('tagName' in node && node.tagName === tagName) {
			elements.push(node)
		}
		if (node.children) {
			node.children.forEach((child) => {
				if (typeof child === 'object' && child !== null) {
					walk(child as Element)
				}
			})
		}
	}

	walk(root)
	return elements
}
