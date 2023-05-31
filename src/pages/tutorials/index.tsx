import pageContent from 'content/tutorials-landing.json'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { Collection } from 'lib/learn-client/types'
import { getCollections } from 'lib/learn-client/api/collection'
import TutorialsLandingView from 'views/tutorials-landing'
import { BETTER_TOGETHER_SECTION_COLLECTION_SLUGS } from 'views/tutorials-landing/constants'

const getStaticProps = async () => {
	const collectionSlugsToFetch = new Set<string>([
		...BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
	])

	Object.values(pageContent).forEach(({ featuredCollectionSlugs }) => {
		featuredCollectionSlugs?.forEach((collectionSlug) => {
			collectionSlugsToFetch.add(collectionSlug)
		})
	})

	const collections = await getCollections(Array.from(collectionSlugsToFetch))

	Object.entries(pageContent).forEach(
		([productSlug, productPageContent]: $TSFixMe) => {
			const featuredCollections = productPageContent.featuredCollectionSlugs
				? productPageContent.featuredCollectionSlugs.map((collectionSlug) => {
						const { name, description, tutorials } = collections.find(
							(collection) => collection.slug === collectionSlug
						)

						let hasVideo = false
						let hasLab = false
						const productsUsed = new Set([productSlug])
						tutorials.forEach((tutorial) => {
							if (!hasVideo && Boolean(tutorial.video)) {
								hasVideo = true
							}

							if (!hasLab && Boolean(tutorial.handsOnLab)) {
								hasLab = true
							}

							tutorial.productsUsed.forEach((productUsed) => {
								productsUsed.add(productUsed.product.slug)
							})
						})

						const badges = [...Array.from(productsUsed)]
						if (hasVideo) {
							badges.push('video')
						}
						if (hasLab) {
							badges.push('interactive')
						}

						return {
							title: name,
							description,
							badges,
							tutorialCount: tutorials.length,
						}
				  })
				: null
			productPageContent.featuredCollections = featuredCollections
		}
	)

	const crossProductSectionCollections =
		BETTER_TOGETHER_SECTION_COLLECTION_SLUGS.map(
			(collectionSlug: Collection['slug']) =>
				collections.find(
					(collection: Collection) => collection.slug === collectionSlug
				)
		)
	console.log({ crossProductSectionCollections })

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
