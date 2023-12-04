/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { generateTableOfContentsSidebar } from './helpers'

describe('generateTableOfContentsSidebar helper function', () => {
	it('returns an empty array if items arg is empty NodeList', () => {
		const emptyNodeList = {} as NodeListOf<HTMLElement>
		const tableOfContents = generateTableOfContentsSidebar(emptyNodeList)
		expect(tableOfContents).toMatchObject([])
	})

	it('returns a heading if the node has dataset.sidebarHeading', () => {
		const headingNode = [
			{ dataset: { sidebarHeading: 'Operating-Systems' } },
		] as unknown as NodeListOf<HTMLElement>
		const formattedHeading = { heading: 'Operating Systems' }
		const tableOfContents = generateTableOfContentsSidebar(headingNode)
		expect(tableOfContents).toMatchObject(formattedHeading)
	})

	it('returns a divider if the node has dataset.sidebarDivider', () => {
		const dividerNode = [
			{ dataset: { sidebarDivider: 'true' } },
		] as unknown as NodeListOf<HTMLElement>
		const formattedDivider = { divider: 'true' }
		const tableOfContents = generateTableOfContentsSidebar(dividerNode)
		expect(tableOfContents).toMatchObject(formattedDivider)
	})

	it('returns a link when the node has an anchor tag sibling element with an href that matches the node id', () => {
		const anchorNode = [
			{
				id: 'macOS',
				nextSibling: { href: 'http://localhost:3000/product/install#macOS' },
			},
		] as unknown as NodeListOf<HTMLElement>
		const formattedAnchor = {
			title: 'macOS',
			fullPath: `#macOs`,
		}
		const tableOfContents = generateTableOfContentsSidebar(anchorNode)
		expect(tableOfContents).toMatchObject(formattedAnchor)
	})

	it('returns an empty object if the node has an id but not an anchor tag sibling element', () => {
		const anchorNode = [
			{
				id: 'macOS',
			},
		] as unknown as NodeListOf<HTMLElement>
		const tableOfContents = generateTableOfContentsSidebar(anchorNode)
		expect(tableOfContents).toMatchObject({})
	})
})
