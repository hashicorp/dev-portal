import slugify from 'slugify'
import { GetStaticPropsContext } from 'next'
import { RootDocsPath } from 'types/products'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { GenerateGetStaticPropsArguments } from './types'

const generateSidecarHeadings = ({
  layoutHeadings,
  marketingContentBlocks,
  pageTitle,
}) => {
  const additionalHeadings = []

  let currentSectionHeading
  marketingContentBlocks.forEach((block) => {
    let thisHeadingObject

    // all section-heading block types are supposed to be h2's
    if (block.type === 'section-heading') {
      const headingSlug = slugify(block.title, { lower: true })
      thisHeadingObject = {
        level: 2,
        title: block.title,
        id: headingSlug,
        slug: headingSlug,
      }
      additionalHeadings.push(thisHeadingObject)
      currentSectionHeading = thisHeadingObject

      return
    }

    // all card-grid headings will be h3's unless a section-heading is before it
    if (block.type === 'card-grid') {
      let cardGridHeadingLevel
      if (currentSectionHeading) {
        cardGridHeadingLevel = currentSectionHeading.level + 1
        currentSectionHeading = null
      } else {
        cardGridHeadingLevel = 2
      }

      const headingSlug = slugify(block.title, { lower: true })
      const cardGridHeading = {
        level: cardGridHeadingLevel,
        title: block.title,
        id: headingSlug,
        slug: headingSlug,
      }
      additionalHeadings.push(cardGridHeading)

      return
    }
  })

  return [
    ...layoutHeadings.map((heading) => {
      if (heading.level === 1) {
        const slug = slugify(pageTitle, { lower: true })
        return { level: 1, id: slug, slug, title: pageTitle }
      } else {
        return heading
      }
    }),
    ...additionalHeadings,
  ]
}

const generateGetStaticProps = ({
  pageContent,
  product,
}: GenerateGetStaticPropsArguments) => {
  const basePath = 'docs'
  const currentRootDocsPath = product.rootDocsPaths.find(
    (rootDocsPath: RootDocsPath) => rootDocsPath.path === basePath
  )
  const baseName = currentRootDocsPath.shortName

  return async (context: GetStaticPropsContext) => {
    const { getStaticProps: generatedGetStaticProps } =
      _getStaticGenerationFunctions({
        product,
        basePath,
        baseName,
      })

    // TODO: replace any with accurate type
    const generatedProps = (await generatedGetStaticProps({
      ...context,
      params: { page: [] },
    })) as any

    // Append headings found in marketing content
    const sidecarHeadings = generateSidecarHeadings({
      layoutHeadings: generatedProps.props.layoutProps.headings,
      marketingContentBlocks: pageContent.marketingContentBlocks,
      pageTitle: `${product.name} ${baseName}`,
    })

    return {
      ...generatedProps,
      props: {
        ...generatedProps.props,
        layoutProps: {
          ...generatedProps.props.layoutProps,
          githubFileUrl: null,
          headings: sidecarHeadings,
        },
        pageHeading: sidecarHeadings[0],
        product: {
          ...generatedProps.props.product,
          currentRootDocsPath,
        },
      },
    }
  }
}

export { generateGetStaticProps }
