import { Definition, Link } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return function transformer(tree) {
		visit(tree, 'jsx', (node: Link | Definition) => {
			console.log(node)
		})
	}
}

export default remarkPluginCalculateImageDimensions
