import pageData from 'content/tutorials-landing.json'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { Collection } from 'lib/learn-client/types'
import { getCollections } from 'lib/learn-client/api/collection'
import TutorialsLandingView from 'views/tutorials-landing'
import { BETTER_TOGETHER_SECTION_COLLECTION_SLUGS } from 'views/tutorials-landing/constants'

const getStaticProps = async () => {
	const collectionSlugsToFetch = new Set<string>([
		...BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
	])

	Object.values(pageData).forEach(({ featuredCollectionSlugs }) => {
		featuredCollectionSlugs?.forEach((collectionSlug) => {
			collectionSlugsToFetch.add(collectionSlug)
		})
	})

	// Fetch the collections
	const collections = await getCollections(Array.from(collectionSlugsToFetch))

	// Package up fetched data for the view
	const pageContent = {}
	Object.entries(pageData).forEach(
		([productSlug, productContent]: $TSFixMe) => {
			const certification = productContent.certificationProgram
			const featuredUseCases = productContent.featuredUseCases
			const featuredCollections = productContent.featuredCollectionSlugs
				? productContent.featuredCollectionSlugs.map((collectionSlug) => {
						const collection = collections.find(
							(collection) => collection.slug === collectionSlug
						)
						return collection
				  })
				: null

			pageContent[productSlug] = {
				certification,
				featuredCollections,
				featuredUseCases,
			}
		}
	)

	const crossProductSectionCollections =
		BETTER_TOGETHER_SECTION_COLLECTION_SLUGS.map(
			(collectionSlug: Collection['slug']) =>
				collections.find(
					(collection: Collection) => collection.slug === collectionSlug
				)
		)

	return {
		props: stripUndefinedProperties({
			pageContent: {
				...pageContent,
				crossProductSectionCollections,
			},
		}),
	}
}

export { getStaticProps }
export default TutorialsLandingView
