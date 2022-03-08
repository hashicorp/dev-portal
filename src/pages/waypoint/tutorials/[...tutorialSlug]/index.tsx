import { getTutorial } from 'lib/learn-client/api/tutorial'
import { ProductOption } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import TutorialView from 'views/tutorial-view'

export default function TutorialPage({ tutorial }) {
  return <TutorialView {...tutorial} />
}

export async function getStaticProps({ params }) {
  const product = ProductOption['waypoint']
  const { tutorialSlug: slug } = params
  const dbSlug = `${product}/${slug[1]}` // Write note on the slug diff structure
  const tutorial = await getTutorial(dbSlug)
  const props = stripUndefinedProperties({
    tutorial,
    product: {
      slug: product,
    },
  })

  return {
    props,
  }
}

/**
 * Note....generating these paths will be different now
 * Instead of getting all tutorial paths....
 * We'll need to... get all collections related to the product
 * then generate the routes based on the collection tutorials
 */
export function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          tutorialSlug: ['some-collection', 'get-started-intro'],
        },
      },
    ],
    fallback: false,
  }
}
