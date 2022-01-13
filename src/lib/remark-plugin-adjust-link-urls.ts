import { visit } from 'unist-util-visit'
import { Link } from 'mdast'
import { Plugin, Transformer } from 'unified'

const remarkPluginAdjustLinkUrls: Plugin = ({
  urlAdjustFn,
}: {
  urlAdjustFn: (url: string) => string
}): Transformer => {
  return function transformer(tree) {
    visit(tree, 'link', (node: Link) => {
      node.url = urlAdjustFn(node.url)
    })
  }
}

export default remarkPluginAdjustLinkUrls
