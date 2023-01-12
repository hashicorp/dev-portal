import { visit } from 'unist-util-visit'
import { Definition, Link } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { processDocsNode } from './helpers'

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			processDocsNode({ node, currentPath, urlAdjustFn })
		})
	}
}

export default remarkPluginAdjustLinkUrls
