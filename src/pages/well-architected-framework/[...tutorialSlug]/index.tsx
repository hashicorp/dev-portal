import { MDXRemote } from 'next-mdx-remote'
import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import {
	getCurrentCollectionTutorial,
	getCollectionContext,
} from 'views/tutorial-view/utils/get-collection-context'
import { FeaturedInCollections } from 'views/tutorial-view/components'
import wafData from 'data/well-architected-framework.json'
import { SectionOption } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'

/**
 * TODO
 * - get sidebar / sidecar layout working
 * - get next / prevous data working
 * - make view file
 * - separate out data gen with view logic
 */

export default function GenericTutorialPage({
	tutorial,
	metadata,
	layoutProps,
}) {
	const {
		slug,
		name,
		readTime,
		edition,
		productsUsed,
		video,
		handsOnLab,
		content,
		collectionCtx,
	} = tutorial
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const featuredInWithoutCurrent = collectionCtx.featuredIn?.filter(
		(c) => c.id !== collectionCtx.current.id
	)
	console.log({ collectionCtx })

	return (
		<SidebarSidecarLayout
			sidecarSlot={null}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(metadata.wafName) as SidebarProps,
			]}
		>
			<TutorialMeta
				heading={{ slug: slug, text: name }}
				meta={{
					readTime,
					edition,
					productsUsed,
					isInteractive,
					hasVideo,
				}}
			/>
			{video?.id && !video.videoInline && (
				<VideoEmbed
					url={getVideoUrl({
						videoId: video.id,
						videoHost: video.videoHost,
					})}
				/>
			)}
			<TabProvider>
				<DevDotContent>
					<MDXRemote {...content} components={MDX_COMPONENTS} />
				</DevDotContent>
			</TabProvider>
			{/* <NextPrevious {...nextPreviousData} /> */}
			<FeaturedInCollections collections={featuredInWithoutCurrent} />
		</SidebarSidecarLayout>
	)
}

export async function getStaticProps({ params }) {
	const { tutorialSlug } = params

	// get all waf collections
	// pick this tutorial out from that collections list
	// get the secondary sidebar level

	const { collection, tutorialReference } = await getCurrentCollectionTutorial(
		wafData.slug as SectionOption,
		tutorialSlug
	)

	// the tutorial doesn't exist in collection - return 404
	if (tutorialReference.dbSlug === null || collection.data === null) {
		return null
	}

	const fullTutorialData = await getTutorial(tutorialReference.dbSlug)
	// double guard if tutorial doesn't exist after call - return 404
	if (fullTutorialData === null) {
		return null
	}

	const { content: serializedContent, headings } = await serializeContent(
		fullTutorialData
	)
	const collectionContext = getCollectionContext(
		collection.data,
		fullTutorialData.collectionCtx
	)

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

		//sidebarSections,
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
