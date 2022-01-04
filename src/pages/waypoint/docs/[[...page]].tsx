import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { anchorLinks } from '@hashicorp/remark-plugins'
import waypointConfig from '../../../../config/waypoint.json'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'
import addFullPathsToNavData from 'layouts/docs/utils/add-full-paths-to-nav-data'
import getDocsBreadcrumbs from 'components/breadcrumb-bar/utils/get-docs-breadcrumbs'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

const productName = waypointConfig.name
const productSlug = waypointConfig.slug
const basePath = 'docs'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointDocsPage(props) {
  return <DocsPage {...props.mdxSource} />
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    product: { name: productName, slug: productSlug },
    basePath,
  })
  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params }) {
  const headings = []

  const { navData, ...restProps } = await generateStaticProps({
    basePath,
    localContentDir: temporary_noop,
    navDataFile: temporary_noop,
    params,
    product: { name: productName, slug: productSlug },
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

  // TODO: this removes the need for fullPath construction
  // TODO: on the client side, within sidebar. But, might
  // TODO: make more sense to build this into generateStaticProps
  // TODO: instead?
  const navDataWithFullPaths = addFullPathsToNavData(fullNavData, [
    productSlug,
    basePath,
  ])

  /* TODO: could be moved into generateStaticProps
     to further reduce boilerplate */
  const breadcrumbLinks = getDocsBreadcrumbs({
    productPath: productSlug,
    productName,
    basePath,
    baseName: 'Docs',
    pathParts: params.page || [],
    navData: navDataWithFullPaths,
  })

  return {
    props: {
      ...restProps,
      layoutProps: {
        headings,
        navData: navDataWithFullPaths,
        breadcrumbLinks,
        githubFileUrl: restProps.githubFileUrl,
        backToLink: {
          text: 'Back to Waypoint',
          url: '/waypoint',
        },
      },
    },
    revalidate: 10,
  }
}

WaypointDocsPage.layout = DocsLayout

export default WaypointDocsPage
