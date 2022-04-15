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
 * account for ANCHOR LINK basic
 *
 * ANCHOR LINK within a query param --
 *
 * query param
 *
 * /collections/{product}/{collection-name} --> /{product}/tutorials/{collection-name}
 * /tutorials/{product}/{tutorial-name}  --> /{product}/tutorials/{collection-name}/{tutorial-name}
 */

import { Link } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import moize, { Options } from 'moize'
import { ProductOption } from 'lib/learn-client/types'
import path, { isAbsolute } from 'path'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

const learnProducts = new RegExp(Object.keys(ProductOption).join('|'), 'g')
const learnLink = new RegExp('(learn.hashicorp.com|collections|tutorials)')
const LEARN_URL = 'https://learn.hashicorp.com/'

// @TODO, test efficacy of the memoization with ISR
const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)

async function generateTutorialMap() {
  console.log('GENERATING MAP') // Going to check the logs to test caching
  const allTutorials = await getAllTutorials({
    fullContent: false,
    slugsOnly: true,
  })

  const mapItems = allTutorials.map((t) => {
    const oldPath = t.slug
    const newPath = getTutorialSlug(t.slug, t.collection_slug)
    return [oldPath, newPath]
  })

  return Object.fromEntries(mapItems)
}

export const rewriteTutorialLinksPlugin: Plugin = () => {
  return async function transformer(tree) {
    const TUTORIAL_MAP = await cachedGenerateTutorialMap()

    visit(tree, 'link', (node: Link) => {
      console.log(node.url, '— ORIGINAL')
      // return early if non tutorial or collection link
      if (!learnLink.test(node.url)) {
        return
      }

      // find product
      const [product] = node.url.match(learnProducts)
      const isBetaProduct =
        __config.dev_dot.beta_product_slugs.includes(product)
      const isExternalLearnLink = node.url.includes('learn.hashicorp.com')
      let queryParam

      if (isBetaProduct) {
        let nodePath = node.url

        // if its an external link, isolate the path to be rewritten
        if (isExternalLearnLink) {
          const fullUrl = new URL(nodePath)
          nodePath = fullUrl.pathname
        }

        if (!isAbsolute(nodePath)) {
          // handle relative paths - edge case
          nodePath = path.format({ root: '/', base: nodePath })
        }

        if (nodePath.includes('?')) {
          const [tutorialSlug, query] = nodePath.split('?')
          nodePath = tutorialSlug
          queryParam = query
        }

        const [, contentType, product, filename] = nodePath.split('/') as [
          string, // the leading slash
          'collections' | 'tutorials',
          ProductOption,
          string
        ]

        // always return relative dev portal path
        if (contentType === 'collections') {
          node.url = `/${product}/tutorials/${filename}`
        } else if (contentType === 'tutorials') {
          let tutorialSlug = [product, filename].join('/')
          let finalSlug

          if (queryParam) {
            // isolate the collection name from the query
            let [, collectionSlug] = queryParam.split('/')
            let anchor = ''

            if (collectionSlug.includes('#')) {
              const [slug, anchorTag] = collectionSlug.split('#')
              collectionSlug = slug

              anchor = `#${anchorTag}`
            }
            finalSlug =
              `/${product}/tutorials/${collectionSlug}/${filename}` + anchor
          } else if (tutorialSlug.includes('#')) {
            const [isolatedSlug, anchor] = tutorialSlug.split('#')
            tutorialSlug = isolatedSlug
            finalSlug = TUTORIAL_MAP[tutorialSlug] + anchor
          } else {
            finalSlug = TUTORIAL_MAP[tutorialSlug]
          }

          node.url = finalSlug
        }
      } else {
        // if its already an external link on a non-beta product, don't rewrite it
        if (!isExternalLearnLink) {
          // if its a relative path, turn it into an external learn link
          node.url = new URL(node.url, LEARN_URL).toString()
        }
      }

      console.log(node.url, '— FINAL')
    })
  }
}
