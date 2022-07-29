import { MDXRemote } from 'next-mdx-remote'
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

export default function TopicsTutorialPage(props) {
	console.log({ props })
	const { readTime, edition, productsUsed, title, content, slug, name, video } =
		props.content

	return (
		<>
			<TutorialMeta
				heading={{ slug: slug, text: name }}
				meta={{
					readTime,
					edition,
					productsUsed,
					isInteractive: false,
					hasVideo: false,
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
				{/* <DevDotContent>
					<MDXRemote {...content} components={MDX_COMPONENTS} />
				</DevDotContent> */}
			</TabProvider>
			{/* <NextPrevious {...nextPreviousData} />
			<FeaturedInCollections
				className={s.featuredInCollections}
				collections={featuredInWithoutCurrent}
			/> */}
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

	return {
		props: stripUndefinedProperties({
			content: serializedContent,
			collectionContext,
			...fullTutorialData,
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

TopicsTutorialPage.layout = BaseNewLayout
