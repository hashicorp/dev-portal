import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { Collection as ApiCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import OnboardingCollectionView from 'views/onboarding/collection-view'
import onboardingData from 'data/onboarding.json'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ collectionSlug: string }>): Promise<{
	props: any
}> {
	const allWafCollections = await getCollectionsBySection(onboardingData.slug)
	const currentCollection = allWafCollections.find(
		(collection: ApiCollection) =>
			collection.slug === `${onboardingData.slug}/${params.collectionSlug}`
	)

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: onboardingData.name },
		{
			title: currentCollection.name,
			url: `/${currentCollection.slug}`,
			isCurrentPage: true,
		},
	]

	return {
		props: stripUndefinedProperties({
			collection: currentCollection,
			layoutProps: { breadcrumbLinks },
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(onboardingData.slug)
	const paths = allCollections.map((c: ApiCollection) => {
		console.log('collection slug', c.slug)
		return {
			params: { collectionSlug: splitProductFromFilename(c.slug) },
		}
	})

	return { paths, fallback: false }
}

export default OnboardingCollectionView
