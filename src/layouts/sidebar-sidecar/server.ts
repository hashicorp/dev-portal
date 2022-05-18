import { Pluggable } from 'unified'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'
import { ProductData } from 'types/products'
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
      const headings = [] // populated by loader.loadStaticProps()

      const loader = getLoader({
        mainBranch,
        remarkPlugins: [
          [anchorLinks, { headings }],
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
          overviewItemHref: `/${product.slug}/${basePath}`,
        },
      ]

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
          breadcrumbLinks,
          githubFileUrl,
          headings: nonEmptyHeadings,
          sidebarNavDataLevels,
        },
        mdxSource,
        product,
        versions,
      }

      return {
        revalidate: __config.dev_dot.revalidate,
        props: finalProps,
      }
    },
  }
}
