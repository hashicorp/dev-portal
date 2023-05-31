import pageContent from 'content/tutorials-landing.json'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { getCollections } from 'lib/learn-client/api/collection'
import TutorialsLandingView from 'views/tutorials-landing'

const getStaticProps = async () => {
	const collectionSlugsToFetch = new Set<string>()

	Object.values(pageContent).forEach(({ featuredCollectionSlugs }) => {
		featuredCollectionSlugs?.forEach((collectionSlug) => {
			collectionSlugsToFetch.add(collectionSlug)
		})
	})

	const collections = await getCollections(Array.from(collectionSlugsToFetch))

	Object.values(pageContent).forEach((productContent: $TSFixMe) => {
		const featuredCollections = productContent.featuredCollectionSlugs
			? productContent.featuredCollectionSlugs.map((collectionSlug) => {
					const collection = collections.find(
						(collection) => collection.slug === collectionSlug
					)
					return collection
			  })
			: null
		productContent.featuredCollections = featuredCollections
	})

	return {
		props: stripUndefinedProperties({
			pageContent,
		}),
	}
}

export { getStaticProps }
export default TutorialsLandingView
