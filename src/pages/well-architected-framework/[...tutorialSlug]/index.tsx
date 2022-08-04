import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import { getCollectionContext } from 'views/tutorial-view/utils/get-collection-context'
import wafData from 'data/well-architected-framework.json'
import wafContent from 'content/well-architected-framework/index.json'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import WellArchitectedFrameworkTutorialView from 'views/well-architected-framework/tutorial-view'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { generateWafCollectionSidebar } from 'views/well-architected-framework/utils/generate-collection-sidebar'
import { getNextPrevious } from 'views/tutorial-view/components'

export async function getStaticProps({ params }) {
	const [collectionFilename, tutorialFilename] = params.tutorialSlug
	const currentPath = `/${wafData.slug}/${params.tutorialSlug.join('/')}`

	// get all the waf collections to generate the collection level sidebar
	const allWafCollections = await getCollectionsBySection(wafData.slug)
	const currentCollection = allWafCollections.find(
		(collection) => collection.slug === `${wafData.slug}/${collectionFilename}`
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

	const { content: serializedContent, headings } = await serializeContent(
		fullTutorialData
	)
	const collectionContext = getCollectionContext(
		currentCollection,
		fullTutorialData.collectionCtx
	)
	const categorizedWafCollectionSidebarItems = buildCategorizedWafSidebar(
		allWafCollections,
		wafContent.sidebarCategories,
		collectionContext.current.slug
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
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: wafData.name, url: `/${wafData.slug}` },
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
	]

	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id
	let nextCollection

	if (isLastTutorial) {
		const filteredSidebarItems = categorizedWafCollectionSidebarItems.filter(
			(item: MenuItem) => !item.divider && !item.heading
		)
		const currentIndex = filteredSidebarItems.findIndex(
			(item: MenuItem) => item.fullPath === `/${currentCollection.slug}`
		)
		const nextSidebarItem: MenuItem = filteredSidebarItems[currentIndex + 1]
		nextCollection = allWafCollections.find((c) => nextSidebarItem?.id === c.id)
	}

	const nextPreviousData = getNextPrevious({
		currentCollection: collectionContext.current,
		currentTutorialSlug: fullTutorialData.slug,
		nextCollectionInSidebar: nextCollection,
		formatting: {
			getCollectionSlug: (collectionSlug: string) => `/${collectionSlug}`,
			getTutorialSlug: (tutorialSlug: string, collectionSlug: string) =>
				`/${collectionSlug}/${splitProductFromFilename(tutorialSlug)}`,
		},
	})

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: fullTutorialData.name,
				description: fullTutorialData.description,
			},
			tutorial: {
				...fullTutorialData,
				content: serializedContent,
				collectionCtx: collectionContext,
				headings,
				nextPreviousData,
			},
			layoutProps: {
				headings,
				breadcrumbLinks,
				navLevels: [
					generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
					generateWafCollectionSidebar(
						wafData,
						categorizedWafCollectionSidebarItems
					),
					{
						title: wafData.name,
						visuallyHideTitle: true,
						showFilterInput: false,
						levelButtonProps: {
							levelUpButtonText: collectionContext.current.shortName,
							levelDownButtonText: fullTutorialData.name,
						},
						backToLinkProps: {
							text: collectionContext.current.shortName,
							href: `/${collectionContext.current.slug}`,
						},
						menuItems: tutorialNavLevelMenuItems,
					},
				],
			},
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
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

export default WellArchitectedFrameworkTutorialView
