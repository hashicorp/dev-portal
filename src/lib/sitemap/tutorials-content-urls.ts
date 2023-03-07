import { getAllCollections } from 'lib/learn-client/api/collection'
import { SectionOption } from 'lib/learn-client/types'
import { activeProductSlugs } from 'lib/products'
import { generateTutorialMap } from 'pages/api/tutorials-map'
import { ProductSlug } from 'types/products'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { makeSitemapElement } from './helpers'
import { Collection as ClientCollection } from 'lib/learn-client/types'

function getTutorialLandingPaths(): string[] {
	const activeSlugs = activeProductSlugs.map(
		(productSlug: ProductSlug) => `/${productSlug}/tutorials`
	)
	const sectionOptionsWithLandingPage = Object.values(SectionOption).filter(
		(option: SectionOption) => option === SectionOption.onboarding
	)
	const sectionOptions = sectionOptionsWithLandingPage.map(
		(slug: SectionOption) => `/${slug}`
	)

	return [...activeSlugs, ...sectionOptions]
}

async function getCollectionAndTutorialPaths() {
	const allCollections = await getAllCollections()

	return allCollections.map((collection: ClientCollection) =>
		getCollectionSlug(collection.slug)
	)
}

export async function allTutorialsUrls() {
	const tutorialLandingUrls = getTutorialLandingPaths().map((slug: string) =>
		makeSitemapElement({ slug })
	)
	const tutorialCollectionUrlsPromise = (
		await getCollectionAndTutorialPaths()
	).map((slug: string) => makeSitemapElement({ slug }))

	const tutorialUrlsPromise = Object.values(await generateTutorialMap()).map(
		(slug: string) => makeSitemapElement({ slug })
	)

	const allTutorialsUrls = await Promise.all([
		...tutorialCollectionUrlsPromise,
		...tutorialUrlsPromise,
	])

	return [...allTutorialsUrls, ...tutorialLandingUrls]
}
