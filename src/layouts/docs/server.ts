import {
  generateStaticPaths as _generateStaticPaths,
  generateStaticProps as _generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { anchorLinks } from '@hashicorp/remark-plugins'

import { Product } from 'types/products'
import prepareNavDataForClient from 'layouts/docs/utils/prepare-nav-data-for-client'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

async function generateStaticPaths({
  product,
  basePath,
}: {
  basePath: string
  product: Product
}): Promise<$TSFixMe[]> {
  const paths = await _generateStaticPaths({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    product,
    basePath,
  })
  return paths
}

async function generateStaticProps({
  basePath,
  params,
  product,
}: {
  basePath: string
  params: $TSFixMe
  product: Product
}): Promise<$TSFixMe> {
  const headings = []

  const { navData, mdxSource, githubFileUrl } = await _generateStaticProps({
    basePath,
    localContentDir: temporary_noop,
    navDataFile: temporary_noop,
    params,
    product,
    remarkPlugins: [[anchorLinks, { headings }]],
  })

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
    pathParts: params.page || [],
    navData: navDataWithFullPaths,
  })

  const finalProps = {
    mdxSource,
    product,
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

  return finalProps
}

export { generateStaticPaths, generateStaticProps }
const defaultExport = { generateStaticPaths, generateStaticProps }
export default defaultExport
