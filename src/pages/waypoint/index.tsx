import { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import slugify from 'slugify'
// imports below are used server-side only
import { generateStaticProps } from '@hashicorp/react-docs-page/server'

const basePath = 'docs'

const productName = 'Waypoint'
const productSlug = 'waypoint'

// TODO add content to each of the page sections,
// TODO and structure it in such a way that it
// TODO corresponds to pre-build, "block"-like
// TODO components. Intent being that this
// TODO content can and should change often,
// TODO and deliver a good deal of flexibility
// TODO in page structure at the authoring level.
// TODO
// TODO ideally we also structure this in such
// TODO a way that it is easy(ish) for us to add
// TODO new "block"-like components for authors to
// TODO use (otherwise, overusing the same
// TODO card components over and over may
// TODO make the content feel stale, even if it's
// TODO not, due to too much visual repetition over time)
const rawAuthoredSections = [
  {
    heading: 'Introduction',
  },
  {
    heading: 'Explore documentation',
  },
  {
    heading: 'Secrets Management',
  },
  {
    heading: 'Data protection',
  },
  {
    heading: 'Identity-based access',
  },
  {
    heading: 'Start learning',
  },
]

const authoredSections = rawAuthoredSections.map((section) => {
  const { heading } = section
  return {
    ...section,
    slug: slugify(heading, { lower: true }),
  }
})

function WaypointLanding(): ReactElement {
  return (
    <div>
      <h1>Welcome to Waypoint</h1>
      <p>This page is a work in progress.</p>
      <p>This page is a work in progress.</p>
      {authoredSections.map((section) => {
        const { slug, heading } = section
        return (
          <div key={slug}>
            <h2 id={slug}>{heading}</h2>
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
    basePath,
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
        headings: authoredSections.map(({ heading, slug }) => ({
          title: heading,
          slug,
          level: 2,
        })),
        navData,
        basePath: `/waypoint/${basePath}`,
      },
    },
    revalidate: 10,
  }
}

WaypointLanding.layout = DocsLayout
export default WaypointLanding
