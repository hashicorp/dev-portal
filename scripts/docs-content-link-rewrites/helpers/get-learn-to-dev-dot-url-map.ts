import { fetchAll } from 'lib/learn-client/api/utils'

const COLLECTION_API_ROUTE = '/collections'
const TUTORIAL_API_ROUTE = '/tutorials'
const LEARN_DOMAIN = 'https://learn.hashicorp.com'

const getNormalizedProductSlug = (slug) => {
	return slug === 'cloud' ? 'hcp' : slug
}

async function getCollectionPagePaths() {
	const paths = {}

	const allCollections = await fetchAll({
		baseUrl: COLLECTION_API_ROUTE,
	})
	allCollections.forEach(({ slug }) => {
		const [productSlug, collectionSlug] = slug.split('/')
		const normalizedProductSlug = getNormalizedProductSlug(productSlug)

		const learnPath = `/collections/${productSlug}/${collectionSlug}`

		let devDotPath
		if (
			normalizedProductSlug === 'onboarding' ||
			normalizedProductSlug === 'well-architected-framework'
		) {
			devDotPath = `/${normalizedProductSlug}/${collectionSlug}`
		} else {
			devDotPath = `/${normalizedProductSlug}/tutorials/${collectionSlug}`
		}

		paths[`${LEARN_DOMAIN}${learnPath}`] = devDotPath
	})

	return paths
}

async function getTutorialPagePaths() {
	const paths = {}

	const allTutorials = await fetchAll({
		baseUrl: TUTORIAL_API_ROUTE,
	})

	allTutorials.forEach((tutorial) => {
		const { default_collection, featured_collections } = tutorial
		const [tutorialProductSlug, tutorialSlug] = tutorial.slug.split('/')

		const baseTutorialPath = `/tutorials/${tutorialProductSlug}/${tutorialSlug}`

		const [defaultCollectionProduct, defaultCollectionSlug] =
			default_collection.slug.split('/')
		const normalizedDefaultCollectionProduct = getNormalizedProductSlug(
			defaultCollectionProduct
		)

		let baseDevDotPath
		if (
			normalizedDefaultCollectionProduct === 'onboarding' ||
			normalizedDefaultCollectionProduct === 'well-architected-framework'
		) {
			baseDevDotPath = `/${normalizedDefaultCollectionProduct}/${defaultCollectionSlug}/${tutorialSlug}`
		} else {
			baseDevDotPath = `/${normalizedDefaultCollectionProduct}/tutorials/${defaultCollectionSlug}/${tutorialSlug}`
		}

		paths[`${LEARN_DOMAIN}${baseTutorialPath}`] = baseDevDotPath

		featured_collections.forEach((collection) => {
			const [collectionProductSlug, collectionSlug] = collection.slug.split('/')
			const normalizedCollectionProductSlug = getNormalizedProductSlug(
				collectionProductSlug
			)

			const learnPath = `${baseTutorialPath}?in=${collection.slug}`

			let devDotPath
			if (
				normalizedCollectionProductSlug === 'onboarding' ||
				normalizedCollectionProductSlug === 'well-architected-framework'
			) {
				devDotPath = `/${normalizedCollectionProductSlug}/${collectionSlug}/${tutorialSlug}`
			} else {
				devDotPath = `/${normalizedCollectionProductSlug}/tutorials/${collectionSlug}/${tutorialSlug}`
			}

			paths[`${LEARN_DOMAIN}${learnPath}`] = devDotPath
		})
	})

	return paths
}

const getProductLandingPaths = () => {
	const result = {}

	Object.entries({
		'/boundary': '/boundary/tutorials/',
		'/cloud': '/cloud/tutorials/',
		'/consul': '/consul/tutorials/',
		'/nomad': '/nomad/tutorials/',
		'/packer': '/packer/tutorials/',
		'/terraform': '/terraform/tutorials/',
		'/vagrant': '/vagrant/tutorials/',
		'/vault': '/vault/tutorials/',
		'/waypoint': '/waypoint/tutorials/',
		'/well-architected-framework': '/well-architected-framework/',
	}).forEach(([oldPath, newPath]) => {
		result[`${LEARN_DOMAIN}${oldPath}`] = newPath
		result[`${LEARN_DOMAIN}${oldPath}/`] = newPath
	})

	return result
}

const getOtherLandingPaths = () => {
	const result = {
		LEARN_DOMAIN: '/',
		[`${LEARN_DOMAIN}/`]: '/',
	}

	Object.entries({
		'/profile/bookmarks': '/profile/bookmarks/',
		'/search': '/tutorials/library/',
	}).forEach(([oldPath, newPath]) => {
		result[`${LEARN_DOMAIN}${oldPath}`] = newPath
		result[`${LEARN_DOMAIN}${oldPath}/`] = newPath
	})

	return result
}

/**
 * Creates a map of Learn URLs and paths to dev dot paths. There are four types
 * of Learn routes to include in the map:
 * 	- collection pages (/collections/productSlug/collectionSlug)
 * 	- tutorial pages (/tutorials/productSlug/tutorialSlug?in=collectionSlug)
 * 	- product landing pages (/productSlug)
 * 	- general pages (profile, search, etc.)
 *
 * Adapted from:
 * https://github.com/hashicorp/learn-redirect-service/blob/main/lib/_tmp/get-learn-to-dev-dot-url-map.js
 */
const getLearnToDevDotUrlMap = async () => {
	try {
		const collectionPaths = await getCollectionPagePaths()
		const tutorialPaths = await getTutorialPagePaths()
		const productLandingPaths = getProductLandingPaths()
		const otherLandingPaths = getOtherLandingPaths()

		const paths = {
			...collectionPaths,
			...tutorialPaths,
			...productLandingPaths,
			...otherLandingPaths,
		}

		return paths
	} catch (e) {
		console.error('Could not generate collection paths ', e.message)
		throw e
	}
}

export { getLearnToDevDotUrlMap }
