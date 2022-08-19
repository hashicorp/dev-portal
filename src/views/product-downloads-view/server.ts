import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { getInlineContentMaps } from 'lib/tutorials/get-inline-content-maps'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import {
	FeaturedLearnContent,
	ProductDownloadsViewStaticProps,
	RawProductDownloadsViewContent,
	FeaturedLearnCard,
} from './types'
import { getInlineTutorials } from 'views/product-tutorials-view/helpers/get-inline-content'

const generateGetStaticProps = (product: ProductData) => {
	return async (): Promise<{
		props: ProductDownloadsViewStaticProps
		revalidate: number
	}> => {
		/**
		 * Fetch page content
		 *
		 * Note: could consider other content sources. For now, JSON.
		 * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
		 */
		const jsonFilePath = path.join(
			process.cwd(),
			`src/content/${product.slug}/install-landing.json`
		)
		const CONTENT: RawProductDownloadsViewContent = JSON.parse(
			fs.readFileSync(jsonFilePath, 'utf8')
		)
		const {
			doesNotHavePackageManagers,
			featuredTutorialsSlugs,
			packageManagerOverrides,
			sidecarMarketingCard,
			sidebarMenuItems,
		} = CONTENT

		/**
		 * Fetch the release data static props
		 */
		const { props: releaseProps, revalidate } =
			await generateReleaseStaticProps(product)
		const { releases, latestVersion } = releaseProps

		/**
		 * The `featuredTutorialsSlugs` array allows two formats of slugs:
		 *   - <product slug>/<collection slug>/<tutorial slug>
		 *   - <product slug>/<tutorial slug>
		 */
		const splitSlugs = (slug) => {
			const slugParts = slug.split('/')
			if (slugParts.length === 3) {
				// Slug format is: <product slug>/<collection slug>/<tutorial slug>
				return {
					productSlug: slugParts[0],
					collectionSlug: slugParts[1],
					tutorialSlug: slugParts[2],
				}
			} else if (slugParts.length === 2) {
				// Slug format is: <product slug>/<tutorial slug>
				return { productSlug: slugParts[0], tutorialSlug: slugParts[1] }
			} else {
				console.error(
					'Found string `featuredTutorialsSlugs` width incorrect number of slash-separated parts:',
					slug
				)
			}
		}

		/**
		 * Gather tutorials and collections based on slugs used
		 */
		const tutorialSlugs = featuredTutorialsSlugs.map((slug) => {
			const { productSlug, tutorialSlug } = splitSlugs(slug)
			return `${productSlug}/${tutorialSlug}`
		})
		const inlineTutorials = await getInlineTutorials(tutorialSlugs)

		/**
		 * Transform feature tutorial and collection entries into card data
		 */
		const featuredLearnCards: FeaturedLearnCard[] = featuredTutorialsSlugs.map(
			(slug: string) => {
				const { productSlug, collectionSlug, tutorialSlug } = splitSlugs(slug)
				const tutorialData = inlineTutorials[`${productSlug}/${tutorialSlug}`]
				const defaultContext = tutorialData.collectionCtx.default
				const tutorialLiteCompat = { ...tutorialData, defaultContext }

				const formattedTutorialCard = formatTutorialCard(tutorialLiteCompat)
				if (collectionSlug) {
					formattedTutorialCard.url = `/${productSlug}/tutorials/${collectionSlug}/${tutorialSlug}`
				}

				return {
					type: 'tutorial',
					...formattedTutorialCard,
				}
			}
		)

		console.log(featuredLearnCards)

		/**
		 * Combine release data and page content
		 */
		const props = stripUndefinedProperties({
			metadata: {
				title: 'Install',
			},
			releases,
			product,
			latestVersion,
			pageContent: {
				doesNotHavePackageManagers,
				featuredLearnCards,
				packageManagerOverrides,
				sidecarMarketingCard,
				sidebarMenuItems,
			},
		})

		return {
			props,
			revalidate,
		}
	}
}

export { generateGetStaticProps }
