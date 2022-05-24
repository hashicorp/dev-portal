import productData from 'data/waypoint.json'
import { LearnProductData } from 'types/products'

import { getTutorialPageProps } from 'views/tutorial-view/server'

function TestMdxPage(props) {
  return (
    <div>
      Hello test MDX page!
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </div>
  )
}

export async function getStaticProps() {
  const slug = 'deploy-aws/aws-lambda'.split('/') as [string, string]
  const staticProps = await getTutorialPageProps(
    productData as LearnProductData,
    slug
  )

  // Handle 404 case
  if (!staticProps) {
    return { notFound: true }
  }

  return staticProps
}

export default TestMdxPage
