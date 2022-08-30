import fs from 'fs'
import { GetStaticPropsContext } from 'next'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import onboardingData from 'data/onboarding.json'

import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { getCollectionContext } from 'views/tutorial-view/utils/get-collection-context'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { getNextPrevious } from 'views/tutorial-view/components'

export async function getOnboardingTutorialProps(
	tutorialSlug: [string, string]
): Promise<{ props: any }> {
	const [collectionFilename, tutorialFilename] = tutorialSlug
	const currentPath = `/${onboardingData.slug}/${tutorialSlug.join('/')}`

	// get all the waf collections to generate the collection level sidebar
	const allOnboardingCollections = await getCollectionsBySection(
		onboardingData.slug
	)
	const currentCollection = allOnboardingCollections.find(
		(collection: ApiCollection) =>
			collection.slug === `${onboardingData.slug}/${collectionFilename}`
	)
	const currentTutorialReference = currentCollection?.tutorials.find((t) =>
		t.slug.endsWith(tutorialFilename)
	)

	// The tutorial doesn't exist in collection - return 404
	if (!currentCollection || !currentTutorialReference) {
		return null
	}

	// Need to get tutorial data with full mdx content
	const fullTutorialData = await getTutorial(currentTutorialReference.slug)

	// Double guard if tutorial doesn't exist after call - return 404
	if (fullTutorialData === null) {
		return null
	}
	console.log({ fullTutorialData })

	// const { content: serializedContent, headings } = await serializeContent(
	// 	fullTutorialData
	// )
	const collectionContext = getCollectionContext(
		currentCollection,
		fullTutorialData.collectionCtx
	)
	const tutorialNavLevelMenuItems = collectionContext.current.tutorials.map(
		(t: ApiTutorialLite) => {
			const fullTutorialPath = `/${
				collectionContext.current.slug
			}/${splitProductFromFilename(t.slug)}`

			return {
				title: t.name,
				id: t.id,
				fullPath: fullTutorialPath,
				isActive: currentPath === fullTutorialPath,
			}
		}
	)

	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id
	let nextCollection

	if (isLastTutorial) {
		const currentIndex = tutorialNavLevelMenuItems.findIndex(
			(item: MenuItem) => item.fullPath === `/${currentCollection.slug}`
		)
		const nextSidebarItem: MenuItem =
			tutorialNavLevelMenuItems[currentIndex + 1]
		nextCollection = allOnboardingCollections.find(
			(c) => nextSidebarItem?.id === c.id
		)
	}

	return {
		props: stripUndefinedProperties({
			tutorial: {
				...fullTutorialData,
				//		content: serializedContent,
				collectionCtx: collectionContext,
				nextPreviousData: getNextPrevious({
					currentCollection: collectionContext.current,
					currentTutorialSlug: fullTutorialData.slug,
					nextCollectionInSidebar: nextCollection,
					formatting: {
						getCollectionSlug: (collectionSlug: string) => `/${collectionSlug}`,
						getTutorialSlug: (tutorialSlug: string, collectionSlug: string) =>
							`/${collectionSlug}/${splitProductFromFilename(tutorialSlug)}`,
					},
				}),
			},
			layoutProps: {
				// headings,
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{ title: onboardingData.name },
					{
						title: collectionContext.current.name,
						url: `/${collectionContext.current.slug}`,
					},
					{
						title: fullTutorialData.name,
						url: `/${collectionContext.current.slug}/${splitProductFromFilename(
							fullTutorialData.slug
						)}`,
						isCurrentPage: true,
					},
				],
				navLevels: [
					generateTopLevelSidebarNavData(onboardingData.name) as SidebarProps,
					{
						title: onboardingData.name,
						levelButtonProps: {
							levelUpButtonText: `Main Menu`,
							levelDownButtonText: 'Previous',
						},
						showFilterInput: false,
						menuItems: tutorialNavLevelMenuItems,
					},
				],
			},
		}),
	}
}

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ tutorialSlug: [string, string] }>): Promise<
	{ props: any } | { notFound: boolean }
> {
	const props_ = await getOnboardingTutorialProps(params.tutorialSlug)
	const props = {
		hi: 'yo',
	}
	console.log({ props_ }, fs)

	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props_
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(onboardingData.slug)
	console.log(allCollections.length, '++++++++++++++')
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
function OnboardingTutorialView(props) {
	console.log({ props })
	return <div>HI</div>
}

export default OnboardingTutorialView
