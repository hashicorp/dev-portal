/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import remark from 'remark'
import { Parent } from 'unist-util-visit'
import visitChildren from 'unist-util-visit-children'
import toString from 'mdast-util-to-string'
import { is, Node } from 'unist-util-is'
// types
import type { Content, Heading, Root } from 'mdast'
import type { Plugin } from 'unified'

/**
 * Content sections immediately after collection.
 * contentNodes are arrays of nodes from the original `mdast` tree.
 */
export type ContentSectionNodes = {
	level: number
	title: string
	contentNodes: Content[]
}

/**
 * Content sections formatted before returning to the consumer.
 * Content has been stringified from `mdast` nodes back into an MDX string.
 */
export type ContentSection = {
	level: number
	title: string
	content: string
}

/**
 * Options for the content section collector remark plugin.
 */
type ContentSectionCollectorPluginOptions = {
	collector: ContentSectionNodes[]
	targetLevel: Heading['depth']
}

/**
 * A remark plugin that collects content nodes in the document,
 * splitting them by headings
 *
 * Populates a provided collector variable with an array of sections.
 * Each section consists of a title string, derived from the heading,
 * as well as an array of top-level content nodes found under the heading.
 */
const contentSectionCollector: Plugin<[ContentSectionCollectorPluginOptions]> =
	({ collector, targetLevel } = { collector: [], targetLevel: 2 }) =>
	(tree: Node) => {
		// Ensure that the provided tree has `children`. If not, error.
		if (!isParent(tree)) {
			throw new Error(
				`contentSectionCollector: provided "tree" does not seem to have "children", so could not be traversed. Please ensure the provided "tree" is a valid unist Parent type.`
			)
		}
		let currentSection: null | ContentSectionNodes = null
		visitChildren(function (node: Content) {
			if (isHeading(node) && node.depth === targetLevel) {
				// Push any existing sections to the collector
				if (currentSection !== null) {
					collector.push(currentSection)
				}
				// Start a new section for this heading's content
				const title = toString(node)
				currentSection = {
					level: node.depth,
					title: title,
					contentNodes: [],
				}
			} else {
				// Push this node to the current section, if there is one.
				// If there is no current section, we're in a space before
				// any headings of the target level have appeared.
				// We ignore content that is not under a target heading.
				if (currentSection !== null) {
					currentSection.contentNodes.push(node)
				}
			}
		})(tree)
		// Ensure any final section gets added
		if (currentSection !== null) {
			collector.push(currentSection)
		}
	}

/**
 * @TODO we need to investigate whether this is actually getting parsed as MDX
 * We may need to use the remark-mdx plugin https://www.npmjs.com/package/remark-mdx/v/1.6.22
 *
 * Given some MDX content, split content on headings of the provided level, and
 * Return an array of content sections.
 */
export async function collectMdContentByHeading(
	mdxContent: string,
	headingLevel: Heading['depth']
): Promise<ContentSection[]> {
	const contentSectionNodes: ContentSectionNodes[] = []

	/**
	 * Run remark using the extraction plugin,
	 * which populates the contentSections array.
	 */
	await remark()
		.use(contentSectionCollector, {
			collector: contentSectionNodes,
			targetLevel: headingLevel,
		})
		.process(mdxContent)

	/**
	 * Stringify the contentNodes in each content section into an mdx string.
	 */
	const contentSections: ContentSection[] = await Promise.all(
		contentSectionNodes.map(async function (contentSection) {
			const { level, title, contentNodes } = contentSection
			const tree: Root = { type: 'root', children: contentNodes }
			// const contentString = toMarkdown(tree)
			const contentString = await remark().stringify(tree)
			return { level, title, content: contentString }
		})
	)

	/**
	 * Return the processed content sections
	 */
	return contentSections
}

/**
 * unist-util-is for `paragraph` nodes,
 * with a type guard so we don't have to cast types.
 */
function isParent(node: unknown): node is Parent {
	return typeof node === 'object' && 'children' in node
}

/**
 * unist-util-is for `heading` nodes,
 * with a type guard so we don't have to cast types.
 */
function isHeading(node: unknown): node is Heading {
	return is(node, 'heading')
}
