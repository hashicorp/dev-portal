import pageData from 'content/tutorials-landing.json'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { getCollections } from 'lib/learn-client/api/collection'
import TutorialsLandingView from 'views/tutorials-landing'

const getStaticProps = async () => {
	// Build up list of collection slugs to fetch
	const collectionSlugsToFetch = new Set<string>()
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

	return {
		props: stripUndefinedProperties({ pageContent }),
	}
}

export { getStaticProps }
export default TutorialsLandingView
