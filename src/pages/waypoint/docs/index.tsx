import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import waypointData from 'data/waypoint.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import ProductRootDocsPathLanding, {
  ProductRootDocsPathLandingProps,
} from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'
import s from './style.module.css'

interface WaypointDocsLandingProps {
  mdxSource: MDXRemoteSerializeResult
  pageHeading: ProductRootDocsPathLandingProps['pageHeading']
}

const WaypointDocsLanding = ({
  mdxSource,
  pageHeading,
}: WaypointDocsLandingProps) => {
  const mdxSlot = (
    <div className={s.waypointMDXWrapper}>
      <DocsView mdxSource={mdxSource} hideSearch />
    </div>
  )
  return (
    <ProductRootDocsPathLanding
      mdxSlot={mdxSlot}
      pageHeading={pageHeading}
      pageContent={pageContent}
    />
  )
}

const getStaticProps = generateGetStaticProps({
  baseName: 'Documentation',
  basePath: 'docs',
  pageContent,
  product: waypointData as ProductData,
})

WaypointDocsLanding.layout = SidebarSidecarLayout
export { getStaticProps }
export default WaypointDocsLanding
