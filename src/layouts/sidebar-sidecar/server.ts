import { Pluggable } from 'unified'
import { visit } from 'unist-util-visit'
import { Image } from 'mdast'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'
import { ProductData, RootDocsPath } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

/**
 * @TODO update the basePaths inside of `src/data/${productSLug}.json` files to
 * be arrays of objects that look like:
 *
 *   ```
 *   {
 *     path: string
 *     name: string
 *   }
 *   ```
 *
 * This will require a decent amount of refactoring code that uses
 * `ProductData['basePaths']`, so this is the temporary stopgap until we can do
 * the refactor. Or decide on another approach. :)
 */
const BASE_PATHS_TO_NAMES = {
  'api-docs': 'API Documentation',
  commands: 'CLI',
  docs: 'Documentation',
  intro: 'Introduction',
  plugins: 'Plugins',
}

// This Remark plugin rewrites img URLs from our Marketing Content Server API
// to Dev Portal's next/image optimization endpoint.
function remarkRewriteImageUrls() {
  return function plugin() {
    return function transformTree(tree) {
      visit<Image, string>(tree, 'image', (node) => {
        if (node.url.includes(process.env.MKTG_CONTENT_API)) {
          const params = new URLSearchParams()
          params.set('url', node.url)
          // next/image requires that we specify an allowed width. The Dev
          // Portal docs page renders images at 896 pixels wide. To support high
          // DPI displays, we double this value to 1792, and round up to the
          // nearest supported width of 1920.
          params.set('w', '1920')
          // By default, next/image uses a quality setting of 75.
          params.set('q', '75')

          node.url = `/_next/image?${params.toString()}`
        }
      })
    }
  }
}

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
export function getStaticGenerationFunctions<
  MdxScope = Record<string, unknown>
>({
  product,
  basePath,
  productSlugForLoader = product.slug,
  basePathForLoader = basePath,
  baseName,
  additionalRemarkPlugins = [],
  getScope = async () => ({} as MdxScope),
  mainBranch,
}: {
  product: ProductData
  basePath: string
  productSlugForLoader?: string
  basePathForLoader?: string
  baseName: string
  additionalRemarkPlugins?: Pluggable[]
  getScope?: () => Promise<MdxScope>
  mainBranch?: string
}): ReturnType<typeof _getStaticGenerationFunctions> {
  /**
   * Beta products, defined in our config files, will source content from a
   * long-lived branch named 'dev-portal'
   */
  const isBetaProduct = getIsBetaProduct(product.slug)

  /**
   * Get the current `rootDocsPaths` object.
   *
   * @TODO - set `baseName` using `rootDocsPath`
   */
  const currentRootDocsPath = product.rootDocsPaths?.find(
    (rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
  )

  const loaderOptions: RemoteContentLoader['opts'] = {
    product: productSlugForLoader,
    basePath: basePathForLoader,
    enabledVersionedDocs: true,
    latestVersionRef: isBetaProduct
      ? __config.dev_dot.content_preview_branch
      : undefined,
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
        paths: paths.slice(0, __config.dev_dot.max_static_paths ?? 0),
      }
    },
    getStaticProps: async (ctx) => {
      const pathParts = (ctx.params.page || []) as string[]
      const headings = [] // populated by loader.loadStaticProps()

      const loader = getLoader({
        mainBranch,
        remarkPlugins: [
          [anchorLinks, { headings }],
          remarkRewriteImageUrls(),
          ...additionalRemarkPlugins,
        ],
        scope: await getScope(),
      })

      /**
       * Try to load the static props for the given context. If there is a
       * ContentApiError with a 404 status, return a 404 status and page.
       * https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
       */
      let loadStaticPropsResult
      try {
        loadStaticPropsResult = await loader.loadStaticProps(ctx)
      } catch (error) {
        // Catch 404 errors, return a 404 status page
        if (error.status === 404) {
          return { notFound: true }
        }

        // Throw non-404 errors
        throw error
      }

      const { navData, mdxSource, githubFileUrl, versions } =
        loadStaticPropsResult

      /**
       * NOTE: we've encountered empty headings on at least one page:
       * "/terraform/enterprise/install/automated/active-active"
       * Passing empty headings to the client creates broken behaviour,
       * so we filter them out.
       * TODO: This change should perhaps be moved into our anchor-links plugin.
       * Either way, we will likely need to keep this fix in place indefinitely,
       * UNLESS we either fix all past versions of docs, OR implement a version
       * cutoff that excludes all past versions of docs with this issue.
       */
      const nonEmptyHeadings = headings.slice().filter(({ title }) => {
        const isValid = typeof title == 'string' && title !== ''
        if (isValid) {
          return true
        } else {
          const paramsAsPath =
            typeof ctx.params.page == 'string'
              ? ctx.params.page
              : ctx.params.page.join('/')
          console.warn(
            `Found an empty title on page "/${product.slug}/${basePath}/${paramsAsPath}". Empty titles are omitted from our sidebar. Ideally, they should be removed in the source MDX.`
          )
        }
      })

      const fullNavData = [...navData]

      // Add fullPaths and ids to navData
      const navDataWithFullPaths = prepareNavDataForClient(fullNavData, [
        product.slug,
        basePath,
      ])

      /**
       * Figure out of a specific docs version is being viewed
       */
      let indexOfVersionPathPart
      let versionPathPart
      if (versions) {
        pathParts.find((pathPart, index) => {
          const matchingVersion = versions.find(
            (version) => pathPart === version.version
          )
          if (matchingVersion) {
            versionPathPart = pathPart
            indexOfVersionPathPart = index
            return true
          }
        })
      }

      /**
       * Constructs the levels of nav data used in the `Sidebar` on all
       * `DocsView` pages.
       */
      const sidebarNavDataLevels = [
        generateTopLevelSidebarNavData(product.name),
        generateProductLandingSidebarNavData(product),
        {
          backToLinkProps: {
            text: `${product.name} Home`,
            href: `/${product.slug}`,
          },
          levelButtonProps: {
            levelUpButtonText: `${product.name} Home`,
          },
          menuItems: navDataWithFullPaths,
          // TODO: won't default after `BASE_PATHS_TO_NAMES` is replaced
          title: BASE_PATHS_TO_NAMES[basePath] || product.name,
          overviewItemHref: versionPathPart
            ? `/${product.slug}/${basePath}/${versionPathPart}`
            : `/${product.slug}/${basePath}`,
        },
      ]

      /**
       * Generate the arguments sent to `getDocsBreadcrumbs` based on whether or
       * not there is a version in the current path.
       */
      let generatedBaseName
      let filteredPathParts
      if (indexOfVersionPathPart >= 0) {
        generatedBaseName = `${baseName} ${versionPathPart}`
        filteredPathParts = pathParts.filter(
          (_, index) => index !== indexOfVersionPathPart
        )
      } else {
        generatedBaseName = baseName
        filteredPathParts = pathParts
      }

      const breadcrumbLinks = getDocsBreadcrumbs({
        baseName: generatedBaseName,
        basePath: basePath,
        navData: navDataWithFullPaths,
        pathParts: filteredPathParts,
        productName: product.name,
        productPath: product.slug,
        version: versionPathPart,
      })

      const finalProps = {
        layoutProps: {
          breadcrumbLinks,
          githubFileUrl,
          headings: nonEmptyHeadings,
          sidebarNavDataLevels,
          versions,
        },
        mdxSource,
        product: {
          ...product,
          // needed for DocsVersionSwitcher
          currentRootDocsPath: currentRootDocsPath || null,
        },
        versions,
      }

      return {
        revalidate: __config.dev_dot.revalidate,
        props: finalProps,
      }
    },
  }
}
