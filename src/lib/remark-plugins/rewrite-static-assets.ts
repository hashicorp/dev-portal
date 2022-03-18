/**
 * This is based on mktg-content-workflow's docs transformers
 * https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/rewrite-static-assets.ts
 *
 * It rewrites image paths to source from the tutorials repository
 * via the GitHub CDN, which is provided by the assets API in mtkg-content-workflows
 */

import path from 'path'
import flatMap from 'unist-util-flatmap'
import { is } from 'unist-util-is'

// types
import { Plugin } from 'unified'
import { Node } from 'unist'
import { Image, Definition } from 'mdast'

const ASSET_API_ENDPOINT =
  process.env.ASSET_API_ENDPOINT ||
  'https://mktg-content-api-hashicorp.vercel.app/api/assets'

export const rewriteStaticAssetsPlugin: Plugin = () => {
  return function transformer(tree) {
    return flatMap(tree, (node: Node) => {
      if (!is<Image>(node, 'image') && !is<Definition>(node, 'definition')) {
        return [node]
      }

      /**
       * Hotfix: the Definition node could be used by an image or link reference
       * This regex checks if the path starts with /img or /public/img. While
       * a brittle check, it prevents links references from breaking.
       *
       * We need to follow with a more comprehensive, long-term solution
       * to selectively delineate image from link.
       */
      const regex = /^\/img|\/public\/img/ // Ensures non-image links aren't rewritten
      const isImagePath = regex.test(node.url)

      if (!isImagePath || !path.isAbsolute(node.url)) {
        return [node]
      }

      const isVercelBuild =
        process.env.VERCEL_ENV === 'production' ||
        process.env.VERCEL_ENV === 'preview'
      const newUrl = new URL(ASSET_API_ENDPOINT)

      /**
       * If building in a vercel preview, we can assume the assets are pushed up
       * to git and can be served via the GH CDN.
       * */
      if (isVercelBuild) {
        const params = newUrl.searchParams

        // for /tutorials previews, we pass the branchname as an env via gh workflow
        // otherwise, for prod, we reference images in the main branch
        const branchName = process.env.PREVIEW_BRANCH || 'main'

        // assumes tutorials has a /public dir where images live
        const assetPath = path.join('public', node.url)

        params.set('product', 'tutorials')
        params.set('version', branchName)
        params.set('asset', assetPath)
      } else {
        //  Otherwise, pass the unchanged path to a custom asset server for local dev
        newUrl.pathname = path.join(newUrl.pathname, node.url)
      }

      node.url = newUrl.toString()

      return [node]
    })
  }
}
