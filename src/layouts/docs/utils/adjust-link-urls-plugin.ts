import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

export default function adjustLinkUrlPlugin({
  urlAdjustFn,
}: {
  urlAdjustFn: (url: string) => string
}): (tree: Root) => void {
  return function transformer(tree) {
    visit(tree, 'link', (node) => {
      node.url = urlAdjustFn(node.url)
    })
  }
}
