import { Pluggable } from 'unified'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'
import { Product } from 'types/products'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import { visit } from 'unist-util-visit'

const BASE_REVALIDATE = 10

let generatedUniqueId = 0

/**
 * Returns static generation functions which can be exported from a page to fetch docs data
 *
 * Example usage:
 *
 * ```ts
 * const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
 *   product,
 *   basePath,
 * })
 *
 * export { getStaticPaths, getStaticProps }
 * ```
 */
export function getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  additionalRemarkPlugins = [],
}: {
  product: Product
  basePath: string
  baseName: string
  additionalRemarkPlugins?: Pluggable[]
}): ReturnType<typeof _getStaticGenerationFunctions> {
  const loaderOptions = {
    product: product.slug,
    basePath,
  }

  // Defining a getter here so that we can pass in remarkPlugins on a per-request basis to collect headings
  const getLoader = (
    extraOptions?: Partial<ConstructorParameters<typeof RemoteContentLoader>[0]>
  ) => new RemoteContentLoader({ ...loaderOptions, ...extraOptions })

  return {
    getStaticPaths: async () => {
      const paths = await getLoader().loadStaticPaths()

      return {
        fallback: 'blocking',
        paths,
      }
    },
    getStaticProps: async (ctx) => {
      const headings = []

      const loader = getLoader({
        remarkPlugins: [
          [anchorLinks, { headings }],
          [
            () => {
              return function transformer(tree) {
                visit(tree, 'jsx', (node) => {
                  const tabPanelRegex = /(<Tab[ |>])(.*)/
                  const tabPanelMatches = node.value.match(tabPanelRegex)
                  if (tabPanelMatches) {
                    const beginning = tabPanelMatches[1]
                    const rest = tabPanelMatches[2]
                    node.value = node.value.replace(
                      tabPanelRegex,
                      `${beginning} id="devdot-id-${generatedUniqueId}" ${rest}`
                    )
                    generatedUniqueId += 1
                  }

                  const tabsRegex = /(<Tabs)(.*)/
                  const tabMatches = node.value.match(tabsRegex)
                  if (tabMatches) {
                    const beginning = tabMatches[1]
                    const rest = tabMatches[2]
                    node.value = node.value.replace(
                      tabsRegex,
                      `${beginning} id="devdot-id-${generatedUniqueId}" ${rest}`
                    )
                    generatedUniqueId += 1
                  }

                  console.log('GENERATED ID IS NOW', generatedUniqueId)
                })
              }
            },
          ],
          ...additionalRemarkPlugins,
        ],
      })

      const {
        navData,
        mdxSource,
        githubFileUrl,
      } = await loader.loadStaticProps(ctx)

      const fullNavData = [
        ...navData,
        { divider: true },
        ...product.sidebar?.resourcesNavData,
      ]

      // Add fullPaths and ids to navData
      const navDataWithFullPaths = prepareNavDataForClient(fullNavData, [
        product.slug,
        basePath,
      ])

      const breadcrumbLinks = getDocsBreadcrumbs({
        productPath: product.slug,
        productName: product.name,
        basePath,
        baseName,
        pathParts: (ctx.params.page || []) as string[],
        navData: navDataWithFullPaths,
      })

      const finalProps = {
        layoutProps: {
          backToLink: {
            text: `Back to ${product.name}`,
            url: `/${product.slug}`,
          },
          breadcrumbLinks,
          githubFileUrl,
          headings,
          navData: navDataWithFullPaths,
          productName: product.name,
        },
        mdxSource,
        product,
      }

      return {
        revalidate: BASE_REVALIDATE,
        props: finalProps,
      }
    },
  }
}
