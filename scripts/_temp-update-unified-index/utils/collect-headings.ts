import remark from 'remark'
import type { Heading } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import toString from 'mdast-util-to-string'

export async function collectHeadings(mdxContent: string): Promise<string[]> {
	const headings: string[] = []

	const headingMapper: Plugin = () => (tree) => {
		visit(tree, 'heading', (node: Heading) => {
			// Include level 1 through level 5 headings
			if (node.depth <= 5) {
				const title = toString(node)
				headings.push(title)
			}
		})
	}

	return remark()
		.use(headingMapper)
		.process(mdxContent)
		.then(() => headings)
}
