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
import { visit } from 'unist-util-visit'
import { ProductOption } from 'lib/learn-client/types'

const learnProducts = new RegExp(Object.keys(ProductOption).join('|'), 'g')
const internalLearnLink = new RegExp(
  '(learn.hashicorp.com?|collections|tutorials)'
)

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return function transformer(tree) {
    visit(tree, 'link', (node: Link) => {
      console.log(node.url, '-- original url!')
      // return early if non tutorial or collection link
      if (!internalLearnLink.test(node.url)) {
        return
      }
      // find product
      const [product] = node.url.match(learnProducts)
      const slugParts = node.url.trim().split('/')
      const isTutorialPath = slugParts.includes('tutorials')
      const isCollectionPath = slugParts.includes('collections')
      const isBetaProduct =
        __config.dev_dot.beta_product_slugs.includes(product)

      if (isBetaProduct) {
        node.url = `/${product}/tutorials/collection-name/tutorial-name`
        // need to get tutorial default collection name
      } else {
        node.url = '/something'
      }

      console.log(node.url, '--final url')
    })
  }
}
