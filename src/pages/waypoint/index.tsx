import { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import slugify from 'slugify'
// imports below are used server-side only
import { generateStaticProps } from '@hashicorp/react-docs-page/server'

const productName = 'Waypoint'
const productSlug = 'waypoint'

const headings = [
  'Introduction',
  'Explore documentation',
  'Secrets Management',
  'Data protection',
  'Identity-based access',
  'Start learning',
].map((title) => ({
  title,
  slug: slugify(title, { lower: true }),
  level: 2,
}))

function WaypointLanding(): ReactElement {
  return (
    <div>
      <h1>Welcome to Waypoint</h1>
      <p>This page is a work in progress.</p>
      <p>This page is a work in progress.</p>
      {headings.map(({ title, slug }) => {
        return (
          <div key={slug}>
            <h2 id={slug}>{title}</h2>
            <p>This page is a work in progress.</p>
            <p>This page is a work in progress.</p>
            <p>This page is a work in progress.</p>
            <p>This page is a work in progress.</p>
            <p>This page is a work in progress.</p>
          </div>
        )
      })}
    </div>
  )
}

export async function getStaticProps() {
  const { navData } = await generateStaticProps({
    basePath: 'docs',
    localContentDir: 'temporary_noop',
    navDataFile: 'temporary_noop',
    params: { page: [] },
    product: { name: productName, slug: productSlug },
    remarkPlugins: [],
  })

  return {
    props: {
      // ...props,
      layoutProps: {
        headings,
        navData,
      },
    },
    revalidate: 10,
  }
}

WaypointLanding.layout = DocsLayout
export default WaypointLanding
