import { visit } from 'unist-util-visit'
import { Definition, Link } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { preAdjustUrl } from './helpers'

const remarkPluginAdjustLinkUrls: Plugin = ({
	currentPath = '',
	urlAdjustFn,
}: {
	currentPath: string
	urlAdjustFn: (url: string) => string
}): Transformer => {
	return function transformer(tree) {
		visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			const urlToAdjust = preAdjustUrl({ currentPath, url: node.url })
			node.url = urlAdjustFn(urlToAdjust)
		})
	}
}

export default remarkPluginAdjustLinkUrls
