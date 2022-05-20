import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import waypointData from 'data/waypoint.json'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'
import s from './style.module.css'

interface WaypointDocsLandingProps {
  mdxSource: MDXRemoteSerializeResult
}

// TODO: abstract the markup to a new view, such as RootDocsPathLandingView
const WaypointDocsLanding = ({ mdxSource }: WaypointDocsLandingProps) => {
  return (
    <ProductRootDocsPathLanding
      pageContent={pageContent}
      mdxSlot={
        <div className={s.waypointMDXWrapper}>
          <DocsView mdxSource={mdxSource} hideSearch />
        </div>
      }
    />
  )
}

const getStaticProps = generateGetStaticProps({
  baseName: 'Docs',
  basePath: 'docs',
  product: waypointData,
})

WaypointDocsLanding.layout = SidebarSidecarLayout
export { getStaticProps }
export default WaypointDocsLanding
