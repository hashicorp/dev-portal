import { Fragment } from 'react'
import HashiHead from '@hashicorp/react-head'
import InstruqtProvider from 'contexts/instruqt-lab'
import { MDXRemote } from 'next-mdx-remote'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { NextPrevious } from 'views/tutorial-view/components'
import { OnboardingTutorialViewProps } from '../types'

export default function OnboardingTutorialView({
	tutorial,
	layoutProps,
}: OnboardingTutorialViewProps) {
	const {
		id,
		slug,
		name,
		readTime,
		edition,
		productsUsed,
		video,
		handsOnLab,
		content,
		nextPreviousData,
	} = tutorial
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment

	return (
		<>
			<HashiHead>
				<meta name="robots" content="noindex, nofollow" />
			</HashiHead>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
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
						tutorialId={id}
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
				</SidebarSidecarLayout>
			</InteractiveLabWrapper>
		</>
	)
}
