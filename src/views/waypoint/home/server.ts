import slugify from 'slugify'
// TODO: need to discuss from whence we should
// TODO: source content down the road. For now,
// TODO: sourcing from JSON for demo purposes.
import TEMP_CONTENT from './content.json'

const productName = 'Waypoint'
const productSlug = 'waypoint'

async function getStaticProps(): Promise<$TSFixMe> {
  const CONTENT = TEMP_CONTENT as $TSFixMe

  // TODO: Content blocks content should likely
  // TODO: be fetched dynamically, currently things
  // TODO: like the title and description of docs pages
  // TODO: are hard-coded alongside the URL to link to.
  // TODO: Should be possible to fetch the title and description
  // TODO: at build time from said URL, to ensure the displayed
  // TODO: content is accurate, while not needing to be
  // TODO: manually kept up to date?
  CONTENT.blocks = CONTENT.blocks.map((block) => {
    const { type, heading } = block
    if (type !== 'heading') return block
    return {
      ...block,
      slug: slugify(heading, { lower: true }),
    }
  })

  const navData = [
    { title: 'Introduction', fullPath: '/waypoint/docs/intro' },
    {
      title: 'Getting Started',
      fullPath: '/waypoint/docs/getting-started',
    },
    { divider: true },
    { heading: 'Resources' },
    {
      title: 'Releases',
      href: 'https://releases.hashicorp.com/waypoint/',
    },
    {
      title: 'HashiCorp Learn',
      href: 'https://learn.hashicorp.com/waypoint',
    },
    {
      title: 'Community Forum',
      href: 'https://discuss.hashicorp.com/c/waypoint/51',
    },
    {
      title: 'Support',
      href: 'https://support.hashicorp.com',
    },
  ]

  /**
   * Note: `product` needs to be set here for the ProductSwitcher to display the
   * correct value.
   */
  return {
    props: {
      content: CONTENT,
      product: {
        basePaths: ['docs', 'commands', 'plugins'],
        slug: productSlug,
        name: productName,
      },
      layoutProps: {
        headings: CONTENT.blocks
          .filter((s) => s.type == 'heading')
          .map(({ heading, slug, level }) => ({
            title: heading,
            slug: slug,
            level,
          })),
        navData,
        backToLink: {
          text: 'Back to Developer',
          url: '/',
        },
        breadcrumbLinks: [
          { title: 'Developer', url: '/' },
          { title: productName, url: `/${productSlug}` },
        ],
      },
    },
    revalidate: 10,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getStaticProps }
