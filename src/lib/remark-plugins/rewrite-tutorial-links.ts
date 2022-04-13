/**
 * If there is a relative path to another tutorial
 * check if the associated product is 'in beta'
 * if it is, rewrite to point internally
 *
 * if not, point it to external learn
 *
 * need to handle link references as well
 *
 * decide whether to write as collection or tutorial slug
 *
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 * /tutorials/{product}/{tutorial-name}  --> /{product}/tutorials/{collection-name}/{tutorial-name}
 */

import { Link } from 'mdast'
import { Plugin } from 'unified'
import { is } from 'unist-util-is'
import { visit } from 'unist-util-visit'

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return function transformer(tree) {
    visit(tree, 'link', (node: Link) => {
      console.log(node.url, '-- original url!')
      node.url = '/something'
      console.log(node.url)
    })
  }
}
