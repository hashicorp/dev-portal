import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import BaseNewLayout from 'layouts/base-new'
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
import { WAF_SLUG } from '..'
import {
	getCurrentCollectionTutorial,
	getCollectionContext,
} from 'views/tutorial-view/utils/get-collection-context'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { FeaturedInCollections } from 'views/tutorial-view/components'

import { _tempCollectionSidebarPlaceholder } from '..'

export default function GenericTutorialPage({
	tutorial,
	metadata,
	layoutProps,
}) {
	console.log({ tutorial }, { metadata }, { layoutProps })
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

	return (
		<>
			<h1>{collectionCtx.current.name}</h1>
			<ul>
				{collectionCtx.current.tutorials.map((t) => (
					<li key={tutorial.id}>
						<Link href={`/${tutorial.slug}`}>
							<a>{tutorial.name}</a>
						</Link>
					</li>
				))}
			</ul>

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
		</>
	)
}

export async function getStaticProps({ params }) {
	const { tutorialSlug } = params

	const { collection, tutorialReference } = await getCurrentCollectionTutorial(
		WAF_SLUG,
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
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: {
				name: 'Well Architected Framework',
				filename: 'well-architected-framework',
			},
			collection: {
				name: collection.data.shortName,
				filename: collection.filename,
			},
			tutorial: {
				name: fullTutorialData.name,
				filename: tutorialReference.filename,
			},
		}),
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
	const allCollections = await getCollectionsBySection(WAF_SLUG)
	const paths = []
	allCollections.forEach((c) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach(({ tutorial }) =>
			paths.push({
				params: {
					tutorialSlug: [
						collectionSlug,
						splitProductFromFilename(tutorial.slug),
					],
				},
			})
		)
	})

	return { paths, fallback: false }
}

GenericTutorialPage.layout = BaseNewLayout
