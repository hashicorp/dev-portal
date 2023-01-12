import { Definition, Link } from 'mdast'
import { Plugin } from 'unified'
import visit from 'unist-util-visit'
import { processDocsNode } from 'lib/remark-plugins/remark-plugin-adjust-link-urls/helpers'

const rewriteLinksPlugin: Plugin = ({
	urlAdjustFn,
	currentPath,
	statistics = { linksToRewrite: {}, unrewriteableLinks: [] },
}: {
	currentPath: string
	statistics?: {
		linksToRewrite: Record<string, string>
		unrewriteableLinks: string[]
	}
	urlAdjustFn: (url: string) => string
}) => {
	return async function transformer(tree) {
		return visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			processDocsNode({ node, currentPath, urlAdjustFn, statistics })
		})
	}
}

export default rewriteLinksPlugin
