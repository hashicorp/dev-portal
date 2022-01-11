import fs from 'fs'
import path from 'path'
import slugify from 'slugify'

async function generateStaticProps({
  product,
  contentJsonFile,
}: {
  product: { slug: string; name: string }
  contentJsonFile: string
}): Promise<$TSFixMe> {
  // TODO: need to discuss from whence we should
  // TODO: source content down the road. For now,
  // TODO: sourcing from JSON for demo purposes.
  const jsonFilePath = path.join(process.cwd(), contentJsonFile)
  const CONTENT = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')) as $TSFixMe

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

  return {
    content: CONTENT,
    layoutProps: {
      headings: CONTENT.blocks
        .filter((s) => s.type == 'heading')
        .map(({ heading, slug, level }) => ({
          title: heading,
          slug: slug,
          level,
        })),
      navData: CONTENT.navData,
      productName: product.name,
      backToLink: {
        text: 'Back to Developer',
        url: '/',
      },
      breadcrumbLinks: [
        { title: 'Developer', url: '/' },
        { title: product.name, url: `/${product.slug}` },
      ],
    },
  }
}

export { generateStaticProps }
// eslint-disable-next-line import/no-anonymous-default-export
export default { generateStaticProps }
