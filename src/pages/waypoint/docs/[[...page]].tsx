import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { anchorLinks } from '@hashicorp/remark-plugins'
import waypointConfig from '../../../../config/waypoint.json'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'
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

  const props = await generateStaticProps({
    basePath,
    localContentDir: temporary_noop,
    navDataFile: temporary_noop,
    params,
    product: { name: productName, slug: productSlug },
    remarkPlugins: [[anchorLinks, { headings }]],
  })

  /* TODO: could be moved into generateStaticProps
     to further reduce boilerplate */
  const breadcrumbLinks = getDocsBreadcrumbs({
    productPath: productSlug,
    productName,
    basePath,
    baseName: 'Docs',
    pathParts: params.page || [],
    navData: props.navData,
  })

  return {
    props: {
      ...props,
      layoutProps: {
        headings,
        navData: props.navData,
        breadcrumbLinks,
        githubFileUrl: props.githubFileUrl,
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
