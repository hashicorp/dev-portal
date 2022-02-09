import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { MenuItem } from 'components/sidebar'
import { ProductSlug } from 'types/products'

export type LandingPageProduct = {
  name: string
  sidebar: {
    landingPageNavData: MenuItem[]
    resourcesNavData: MenuItem[]
  }
  slug: ProductSlug
}

async function generateStaticProps({
  product,
  contentJsonFile,
}: {
  product: LandingPageProduct
  contentJsonFile: string
}): Promise<$TSFixMe> {
  // TODO: need to discuss from whence we should
  // TODO: source content down the road. For now,
  // TODO: sourcing from JSON for demo purposes.
  // Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
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
  // Asana task: https://app.asana.com/0/1201010428539925/1201646299837754/f
  const usedHeadings = []
  CONTENT.blocks = CONTENT.blocks.map((block) => {
    switch (block.type) {
      case 'heading':
        // augment heading blocks with a consistent slug,
        // used for anchor linking
        // if the resulting slug is not unique, append an
        // integer suffix to make sure that it is
        // eslint-disable-next-line no-case-declarations
        const baseSlug = slugify(block.heading, { lower: true })
        // eslint-disable-next-line no-case-declarations
        let slug = baseSlug
        // eslint-disable-next-line no-case-declarations
        let slugMakeUniquePrefix = 0
        while (usedHeadings.indexOf(slug) !== -1) {
          slugMakeUniquePrefix++
          slug = `${baseSlug}-${slugMakeUniquePrefix}`
        }
        usedHeadings.push(slug)
        return { ...block, slug }
      case 'cards':
        // TODO: instead of the below, should likely use product context
        // TODO: in IconTile for default brandColor (rather than current
        // TODO: behavior of static default to "neutral"). Would eliminate
        // TODO: the need to add iconBrandColor to cards (unless doing so
        // TODO: as an explicit override).
        // ensure cards with icons have an iconBrandColor,
        // falling back to the current product if not set
        /* eslint-disable-next-line no-case-declarations */
        let defaultIconColor
        if (product.slug === 'hcp' || product.slug === 'sentinel') {
          defaultIconColor = 'neutral'
        } else {
          defaultIconColor = product.slug
        }
        return {
          ...block,
          cards: block.cards.map((card) => ({
            ...card,
            iconBrandColor: card.iconBrandColor || defaultIconColor,
          })),
        }
      default:
        return block
    }
  })

  const navData = [
    ...product.sidebar.landingPageNavData,
    { divider: true },
    ...product.sidebar.resourcesNavData,
  ]

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
      navData,
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
    product,
  }
}

export { generateStaticProps }
// eslint-disable-next-line import/no-anonymous-default-export
export default { generateStaticProps }
