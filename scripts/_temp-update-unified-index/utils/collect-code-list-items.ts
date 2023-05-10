import remark from 'remark'
import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
// types
import type { ListItem, Paragraph, InlineCode } from 'mdast'
import type { Plugin } from 'unified'

/**
 * A remark plugin that finds <li /> nodes that start with inline code,
 * and extracts the inline code's text content.
 *
 * Text content for each inline code item is pushed to the provided
 * `collector` variable, which is required for the plugin to function.
 */
const codeListItemCollector: Plugin<[{ collector: string[] }]> =
	({ collector } = { collector: [] }) =>
	(tree) => {
		visit(tree, 'listItem', (node: ListItem) => {
			// If the list node has no children, skip it
			if (!node.children) {
				return
			}
			// We expect the child node to be a paragraph, with nested children.
			const childNode = node.children[0]
			if (!isParagraph(childNode) || !childNode.children) {
				return
			}
			// We expect the nested child to be an inline code node.
			const nestedChild = childNode.children[0]
			if (!isInlineCode(nestedChild)) {
				return
			}
			// If we have found <li> → <p> → <code>, then we extract the text.
			collector.push(nestedChild.value)
		})
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
export async function collectCodeListItems(
	mdxContent: string
): Promise<string[]> {
	const codeListItems: string[] = []

	/**
	 * Run remark using the extraction plugin,
	 * then return the collected array of `codeListItems`
	 */
	return remark()
		.use(codeListItemCollector, { collector: codeListItems })
		.process(mdxContent)
		.then(() => codeListItems)
}

/**
 * unist-util-is for `paragraph` nodes,
 * with a type guard so we don't have to cast types.
 */
function isParagraph(node: unknown): node is Paragraph {
	return is(node, 'paragraph')
}

/**
 * unist-util-is for `inlineCode` nodes,
 * with a type guard so we don't have to cast types.
 */
function isInlineCode(node: unknown): node is InlineCode {
	return is(node, 'inlineCode')
}
