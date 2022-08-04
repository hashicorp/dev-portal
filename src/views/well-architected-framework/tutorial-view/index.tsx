import { MDXRemote } from 'next-mdx-remote'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import { FeaturedInCollections } from 'views/tutorial-view/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { NextPrevious } from 'views/tutorial-view/components'
import s from 'views/tutorial-view/tutorial-view.module.css'
import { WafTutorialViewProps } from '../types'
/**
 * TODO
 * - check design spec for any inconsistencies
 * - vet the links
 * - check on the tutorial rewrite plugin, to accept waf links
 */

export default function WellArchitectedFrameworkTutorialView({
	tutorial,
	layoutProps,
}: WafTutorialViewProps) {
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
		nextPreviousData,
	} = tutorial
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const featuredInWithoutCurrent = collectionCtx.featuredIn?.filter(
		(c) => c.id !== collectionCtx.current.id
	)

	return (
		<SidebarSidecarLayout
			headings={layoutProps.headings}
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
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
			<NextPrevious {...nextPreviousData} />
			<FeaturedInCollections
				className={s.featuredInCollections}
				collections={featuredInWithoutCurrent}
			/>
		</SidebarSidecarLayout>
	)
}
