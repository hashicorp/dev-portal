import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import {
	ProductDownloadsViewStaticProps,
	RawProductDownloadsViewContent,
	FeaturedTutorialCard,
} from './types'
import {
	generateFeaturedTutorialsCards,
	sortAndFilterReleaseVersions,
} from './helpers'

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
		 * Transform featured tutorial entries into card data
		 */
		let featuredTutorialCards: FeaturedTutorialCard[]
		if (featuredTutorialsSlugs && featuredTutorialsSlugs.length > 0) {
			featuredTutorialCards = await generateFeaturedTutorialsCards(
				featuredTutorialsSlugs
			)
		}

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
				featuredTutorialCards,
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
