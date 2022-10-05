import fs from 'fs'
import path from 'path'
import { ProductData } from 'types/products'
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import {
	ProductDownloadsViewStaticProps,
	RawProductDownloadsViewContent,
	FeaturedTutorialCard,
	FeaturedCollectionCard,
} from './types'
import {
	generateFeaturedCollectionsCards,
	generateFeaturedTutorialsCards,
	generateDefaultPackageManagers,
	generateEnterprisePackageManagers,
	sortAndFilterReleaseVersions,
} from './helpers'
import { generatePackageManagers } from './server-helpers'

interface GenerateStaticPropsOptions {
	isEnterpriseMode?: boolean
	releaseSlug?: string
	jsonFilePath?: string
	installName?: string
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
			options.jsonFilePath || `src/content/${product.slug}/install-landing.json`
		)
		const CONTENT: RawProductDownloadsViewContent = JSON.parse(
			fs.readFileSync(jsonFilePath, 'utf8')
		)
		const {
			doesNotHavePackageManagers,
			featuredCollectionsSlugs,
			featuredTutorialsSlugs,
			packageManagerOverrides,
			sidebarMenuItems,
			sidecarMarketingCard,
		} = CONTENT

		/**
		 * Fetch the release data static props
		 */
		const { props: releaseProps, revalidate } =
			await generateReleaseStaticProps(options.releaseSlug || product)
		const { releases, latestVersion } = releaseProps
		const sortedAndFilteredVersions = sortAndFilterReleaseVersions({
			releaseVersions: releases.versions,
			isEnterpriseMode,
		})

		/**
		 * Transform featured collection entries into card data
		 */
		let featuredCollectionCards: FeaturedCollectionCard[]
		if (featuredCollectionsSlugs && featuredCollectionsSlugs.length > 0) {
			featuredCollectionCards = await generateFeaturedCollectionsCards(
				featuredCollectionsSlugs
			)
		}

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
		 * Build package manager data
		 */
		const packageManagers = doesNotHavePackageManagers
			? []
			: await generatePackageManagers({
					defaultPackageManagers: isEnterpriseMode
						? generateEnterprisePackageManagers(product)
						: generateDefaultPackageManagers(product),
					packageManagerOverrides: packageManagerOverrides,
			  })

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
				featuredCollectionCards,
				featuredTutorialCards,
				installName: options.installName,
				sidebarMenuItems,
				sidecarMarketingCard,
			},
			product,
			releases,
			sortedAndFilteredVersions,
			packageManagers,
		})

		return {
			props,
			revalidate,
		}
	}
}

export { generateGetStaticProps }
