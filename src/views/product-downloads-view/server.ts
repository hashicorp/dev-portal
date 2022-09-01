import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import {
	ProductDownloadsViewStaticProps,
	RawProductDownloadsViewContent,
	FeaturedLearnCard,
} from './types'
import { getInlineTutorials } from 'views/product-tutorials-view/helpers/get-inline-content'
import { sortAndFilterReleaseVersions } from './helpers'

interface GenerateStaticPropsOptions {
	isEnterpriseMode?: boolean
}

const generateGetStaticProps = (
	product: ProductData,
	options: GenerateStaticPropsOptions = {}
) => {
	const { isEnterpriseMode = false } = options

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
		const sortedAndFilteredVersions = sortAndFilterReleaseVersions({
			releaseVersions: releases.versions,
			isEnterpriseMode,
		})

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

		/**
		 * Combine release data and page content
		 */
		const props = stripUndefinedProperties({
			isEnterpriseMode,
			latestVersion: isEnterpriseMode ? `${latestVersion}+ent` : latestVersion,
			metadata: {
				title: 'Install',
			},
			pageContent: {
				doesNotHavePackageManagers,
				featuredLearnCards,
				packageManagerOverrides,
				sidecarMarketingCard,
				sidebarMenuItems,
			},
			product,
			releases,
			sortedAndFilteredVersions,
		})

		return {
			props,
			revalidate,
		}
	}
}

export { generateGetStaticProps }
