import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { anchorLinks } from '@hashicorp/remark-plugins'

import prepareNavDataForClient from 'layouts/docs/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'

const BASE_REVALIDATE = 10

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
}: {
  product: { slug: string; name: string }
  basePath: string
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

      const loader = getLoader({ remarkPlugins: [[anchorLinks, { headings }]] })

      const {
        navData,
        mdxSource,
        githubFileUrl,
      } = await loader.loadStaticProps(ctx)

      /**
       * TODO: these will be different by product,
       * can abstract these further later.
       * Placing here because we need these links
       * in the sidebar on all /waypoint/docs views.
       */
      const fullNavData = [
        ...navData,
        { divider: true },
        {
          title: 'HashiCorp Learn',
          href: 'https://learn.hashicorp.com/waypoint',
        },
        {
          title: 'Community Forum',
          href: 'https://discuss.hashicorp.com/c/waypoint/51',
        },
        {
          title: 'Support',
          href: 'https://support.hashicorp.com/',
        },
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
        baseName: 'Docs',
        pathParts: (ctx.params.page || []) as string[],
        navData: navDataWithFullPaths,
      })

      const finalProps = {
        mdxSource,
        layoutProps: {
          headings,
          navData: navDataWithFullPaths,
          breadcrumbLinks,
          githubFileUrl,
          backToLink: {
            text: `Back to ${product.name}`,
            url: `/${product.slug}`,
          },
        },
      }

      return {
        revalidate: BASE_REVALIDATE,
        props: finalProps,
      }
    },
  }
}
