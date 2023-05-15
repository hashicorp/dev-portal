import pageContent from 'content/tutorials-landing.json'
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
	console.log(collections)

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

	return {
		props: {
			pageContent,
		},
	}
}

export { getStaticProps }
export default TutorialsLandingView
