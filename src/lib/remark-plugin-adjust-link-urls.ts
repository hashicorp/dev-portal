import { visit } from 'unist-util-visit'
import { Plugin } from 'unified'

const remarkPluginAdjustLinkUrls = ({
  urlAdjustFn,
}: {
  urlAdjustFn: (url: string) => string
}): Plugin => {
  return function transformer(tree) {
    visit(tree, 'link', (node) => {
      node.url = urlAdjustFn(node.url)
    })
  }
}

export default remarkPluginAdjustLinkUrls
