import productData from 'data/waypoint.json'
import { LearnProductData } from 'types/products'
import TabProvider from 'components/tabs/provider'
import DevDotContent from 'components/dev-dot-content'
import { MDXRemote } from 'next-mdx-remote'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'

import { getTutorialPageProps } from 'views/tutorial-view/server'

function TestMdxPage({ layout, product, tutorial }) {
  const { content } = tutorial

  return (
    <>
      <div style={{ maxWidth: '896px', margin: '2rem auto' }}>
        <TabProvider>
          <DevDotContent>
            <MDXRemote {...content} components={MDX_COMPONENTS} />
          </DevDotContent>
        </TabProvider>
      </div>
    </>
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
