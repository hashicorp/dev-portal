import { visit } from 'unist-util-visit'
import { Image } from 'mdast'
import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from '@hashicorp/react-docs-page/server'

// This Remark plugin rewrites img URLs from our Marketing Content Server API
// to Dev Portal's next/image optimization endpoint.
function remarkRewriteImageUrls() {
  return function plugin() {
    return function transformTree(tree) {
      visit<Image, string>(tree, 'image', (node) => {
        if (node.url.includes(process.env.MKTG_CONTENT_API)) {
          const params = new URLSearchParams()
          params.set('url', node.url)
          // next/image requires that we specify an allowed width. The .io docs
          // page renders images at 909 pixels wide. To support high DPI
          // displays, we double this value to 1818, and round up to the nearest
          // supported width of 1920.
          params.set('w', '1920')
          // By default, next/image uses a quality setting of 75.
          params.set('q', '75')

          node.url = `/_next/image?${params.toString()}`
        }
      })
    }
  }
}

export const getStaticGenerationFunctions: typeof getStaticGenerationFunctionsBase =
  (...args) => {
    if (!args[0].revalidate && args[0].strategy === 'remote') {
      args[0].revalidate = __config.io_sites.revalidate
    }

    if (args[0].strategy === 'remote') {
      if (Array.isArray(args[0].remarkPlugins)) {
        args[0].remarkPlugins.push(remarkRewriteImageUrls())
      } else {
        args[0].remarkPlugins = [remarkRewriteImageUrls()]
      }
    }

    const { getStaticPaths: getStaticPathsBase, getStaticProps } =
      getStaticGenerationFunctionsBase(...args)

    return {
      async getStaticPaths(ctx) {
        const result = await getStaticPathsBase(ctx)

        return {
          ...result,
          paths: result.paths.slice(0, __config.io_sites.max_static_paths ?? 0),
        }
      },
      getStaticProps,
    }
  }
