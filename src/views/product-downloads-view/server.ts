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
		 * Gather tutorials and collections based on slugs used
		 */
		const inlineTutorials = await getInlineTutorials(featuredTutorialsSlugs)

		console.log(inlineTutorials)

		/**
		 * Transform feature tutorial and collection entries into card data
		 */
		const featuredLearnCards: FeaturedLearnCard[] = featuredTutorialsSlugs.map(
			(tutorialSlug: string) => {
				const tutorialData = inlineTutorials[tutorialSlug]
				const defaultContext = tutorialData.collectionCtx.default
				const tutorialLiteCompat = { ...tutorialData, defaultContext }

				return { type: 'tutorial', ...formatTutorialCard(tutorialLiteCompat) }
			}
		)

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
