import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import onboardingData from 'data/onboarding.json'
import { getOnboardingTutorialProps } from 'views/onboarding/tutorial-view/server'
import OnboardingTutorialView from 'views/onboarding/tutorial-view'
import { OnboardingTutorialViewProps } from 'views/onboarding/types'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ tutorialSlug: [string, string] }>): Promise<
	{ props: OnboardingTutorialViewProps } | { notFound: boolean }
> {
	const props = await getOnboardingTutorialProps(params.tutorialSlug)

	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(onboardingData.slug)
	const paths = []
	allCollections.forEach((c: ApiCollection) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach(({ slug }: { slug: ApiTutorialLite['slug'] }) =>
			paths.push({
				params: {
					tutorialSlug: [collectionSlug, splitProductFromFilename(slug)],
				},
			})
		)
	})

	return { paths, fallback: false }
}

export default OnboardingTutorialView
