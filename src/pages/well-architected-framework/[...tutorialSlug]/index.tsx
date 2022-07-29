import { MDXRemote } from 'next-mdx-remote'
import { serializeContent } from 'views/tutorial-view/utils/serialize-content'
import BaseNewLayout from 'layouts/base-new'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import { WAF_SLUG, _tempGetCollectionsForDir } from '..'

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
				<DevDotContent>
					<MDXRemote {...content} components={MDX_COMPONENTS} />
				</DevDotContent>
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
	const dbSlug = `${WAF_SLUG}/${tutorialSlug[1]}`
	const tutorialData = await getTutorial(dbSlug)
	const { content: serializedContent, headings } = await serializeContent(
		tutorialData
	)
	const formattedData = {
		...tutorialData,
		content: serializedContent,
	}

	return {
		props: stripUndefinedProperties({ content: formattedData }),
	}
}

export async function getStaticPaths() {
	const allCollections = await _tempGetCollectionsForDir(WAF_SLUG)
	const paths = []
	allCollections.forEach((c) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach((t) =>
			paths.push({
				params: {
					tutorialSlug: [collectionSlug, splitProductFromFilename(t.slug)],
				},
			})
		)
	})

	return { paths, fallback: false }
}

TopicsTutorialPage.layout = BaseNewLayout
