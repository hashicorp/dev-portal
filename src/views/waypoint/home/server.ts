import { generateStaticProps } from '@hashicorp/react-docs-page/server'
import slugify from 'slugify'
// TODO: need to discuss from whence we should
// TODO: source content down the road. For now,
// TODO: sourcing from JSON for demo purposes.
import TEMP_CONTENT from './content.json'

const basePath = 'docs'
const productName = 'Waypoint'
const productSlug = 'waypoint'

async function getStaticProps(): Promise<$TSFixMe> {
  const CONTENT = TEMP_CONTENT as $TSFixMe

  CONTENT.blocks = CONTENT.blocks.map((block) => {
    const { type, heading } = block
    if (type !== 'heading') return block
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

  const customNavData = [
    { title: 'Introduction', path: 'intro' },
    { title: 'Getting Started', path: 'getting-started' },
    { divider: true },
    { heading: 'Resources' },
    { title: 'Releases', href: 'https://www.hashicorp.com' },
    { title: 'HashiCorp Learn', href: 'https://www.hashicorp.com' },
    { title: 'Community Forum', href: 'https://www.hashicorp.com' },
    { title: 'Support', href: 'https://www.hashicorp.com' },
  ]

  return {
    props: {
      CONTENT,
      layoutProps: {
        headings: CONTENT.blocks
          .filter((s) => s.type == 'heading')
          .map(({ heading, __heading_slug, level }) => ({
            title: heading,
            slug: __heading_slug,
            level,
          })),
        navData: customNavData,
        basePaths: ['waypoint', basePath],
      },
    },
    revalidate: 10,
  }
}

export default { getStaticProps }
