import slugify from 'slugify'
// TODO: need to discuss from whence we should
// TODO: source content down the road. For now,
// TODO: sourcing from JSON for demo purposes.
import TEMP_CONTENT from './content.json'

const basePath = 'docs'

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
    { title: 'Introduction', path: 'intro' },
    { title: 'Getting Started', path: 'getting-started' },
    { divider: true },
    { heading: 'Resources' },
    {
      title: 'Releases',
      href: 'https://releases.hashicorp.com',
      _demoExternalLink: true,
    },
    {
      title: 'HashiCorp Learn',
      href: 'https://learn.hashicorp.com',
      _demoExternalLink: true,
    },
    {
      title: 'Community Forum',
      href: 'https://discuss.hashicorp.com',
      _demoExternalLink: true,
    },
    {
      title: 'Support',
      href: 'https://support.hashicorp.com',
      _demoExternalLink: true,
    },
  ]

  return {
    props: {
      CONTENT,
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
        basePaths: ['waypoint', basePath],
      },
    },
    revalidate: 10,
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getStaticProps }
