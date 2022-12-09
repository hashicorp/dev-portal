// npm i mdast-util-to-string@2 remark@12 unist-util-visit-children@1
import remark from 'remark'
import { Parent } from 'unist-util-visit'
import visitChildren from 'unist-util-visit-children'
import toString from 'mdast-util-to-string'
import { is } from 'unist-util-is'
// types
import type { Content, Heading, Root } from 'mdast'
import type { Plugin } from 'unified'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ContentSectionNodes = {
	level: number
	title: string
	contentNodes: Content[]
}

export type ContentSection = {
	level: number
	title: string
	content: string
}

/**
 * TODO: update description
 *
 * A remark plugin that finds <li /> nodes that start with inline code,
 * and extracts the inline code's text content.
 *
 * Text content for each inline code item is pushed to the provided
 * `collector` variable, which is required for the plugin to function.
 */
const contentSectionCollector: Plugin<
	[{ collector: ContentSectionNodes[]; targetLevel: HeadingLevel }]
> =
	({ collector, targetLevel } = { collector: [], targetLevel: 2 }) =>
	(tree) => {
		// Ensure that the provided tree has `children`. If not, error.
		if (!isParent(tree)) {
			throw new Error(
				`contentSectionCollector: provided "tree" does not seem to have "children", so could not be traversed. Please ensure the provided "tree" is a valid unist Parent type.`
			)
		}
		let currentSection: null | ContentSectionNodes = null
		visitChildren(function (node) {
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
 * Given some MDX content,
 * find all <li> nodes that start with inline code, and
 * Return an array of text values for all those bits of inline code lists.
 *
 * For context, in many MDX documents, we list parameters or options as
 * lists, with each items starting with <code>. The text content of those <code>
 * elements often represents relatively important parameters or options.
 * Being able to extract the text means we can do things like search index it.
 */
export async function collectMdContentByHeading(
	mdxContent: string
): Promise<ContentSection[]> {
	const contentSectionNodes: ContentSectionNodes[] = []

	/**
	 * Run remark using the extraction plugin,
	 * which populates the contentSections array.
	 */
	await remark()
		.use(contentSectionCollector, {
			collector: contentSectionNodes,
			targetLevel: 2,
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
