import { generateStaticProps } from '@hashicorp/react-docs-page/server'
import slugify from 'slugify'
// TODO: need to discuss from whence we should
// TODO: source content down the road. For now,
// TODO: sourcing from JSON for demo purposes.
import TEMP_CONTENT from './content.json'

const basePath = 'docs'
const productName = 'Waypoint'
const productSlug = 'waypoint'

async function getStaticProps(): $TSFixMe {
  const CONTENT = TEMP_CONTENT as $TSFixMe

  CONTENT.blocks = CONTENT.blocks.map((block) => {
    const { type, heading } = block
    if (['h1', 'h2', 'h3'].indexOf(type) < 0) return block
    return {
      ...block,
      __heading_slug: slugify(heading, { lower: true }),
    }
  })

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
      CONTENT,
      // ...props,
      layoutProps: {
        headings: CONTENT.blocks
          .filter((s) => s.__heading_slug)
          .map(({ heading, __heading_slug, type }) => ({
            title: heading,
            slug: __heading_slug || null,
            level: parseInt(type.substring(1)),
          })),
        navData,
        basePaths: ['waypoint', basePath],
      },
    },
    revalidate: 10,
  }
}

export default { getStaticProps }
