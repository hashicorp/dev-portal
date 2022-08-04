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
import { TutorialViewSidebarContent } from 'components/tutorials-sidebar'
import { formatTutorialToMenuItem } from 'views/tutorial-view/utils'

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
	const collectionNavLevel = {
		title: wafData.name,
		levelButtonProps: {
			levelUpButtonText: `Main Menu`,
			levelDownButtonText: 'Previous',
		},
		overviewItemHref: `/${wafData.slug}`,
		menuItems: buildCategorizedWafSidebar(
			allWafCollections,
			wafContent.sidebarCategories,
			collectionContext.current.slug
		),
		showFilterInput: false,
	}
	const tutorialNavLevel = {
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
		children: (
			<TutorialViewSidebarContent
				items={collectionContext.current.tutorials.map((t) =>
					formatTutorialToMenuItem(
						t,
						collectionContext.current.slug,
						currentPath
					)
				)}
			/>
		),
	}

	const layoutProps = {
		headings,
		breadcrumbLinks: [
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
		],
		navLevels: [collectionNavLevel, tutorialNavLevel],
	}
	const lastTutorialIndex = collectionContext.current.tutorials.length - 1
	const isLastTutorial =
		collectionContext.current.tutorials[lastTutorialIndex].id ===
		fullTutorialData.id

	const nextCollection = undefined

	/**TODO get the next collection from the sidebar data... */

	// if (isLastTutorial) {
	// 	nextCollection = await getNextCollectionInSidebar({
	// 		product: product.slug as ProductOption,
	// 		after: collectionContext.current.slug,
	// 	})
	// }

	return {
		props: stripUndefinedProperties({
			metadata: {
				wafName: wafData.name,
				wafSlug: wafData.slug,
				title: fullTutorialData.name,
				description: fullTutorialData.description,
			},
			tutorial: {
				...fullTutorialData,
				content: serializedContent,
				collectionCtx: collectionContext,
				headings,
				nextCollectionInSidebar: nextCollection,
			},
			layoutProps,
			nextCollection,
		}),
	}
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
	const paths = []
	allCollections.forEach((c) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach(({ slug }) =>
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
