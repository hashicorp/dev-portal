import HashiHead from '@hashicorp/react-head'
import { Fragment } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import InstruqtProvider from 'contexts/instruqt-lab'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import { FeaturedInCollections } from 'views/tutorial-view/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { NextPrevious } from 'views/tutorial-view/components'
import { generateCanonicalUrl } from 'views/tutorial-view/utils'
import OptInOut from 'components/opt-in-out'
import s from 'views/tutorial-view/tutorial-view.module.css'
import { WafTutorialViewProps } from '../types'

export default function WellArchitectedFrameworkTutorialView({
	tutorial,
	layoutProps,
}: WafTutorialViewProps) {
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
		collectionCtx,
		nextPreviousData,
	} = tutorial
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const featuredInWithoutCurrent = collectionCtx.featuredIn?.filter(
		(c) => c.id !== collectionCtx.current.id
	)
	const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment
	const canonicalCollectionSlug = tutorial.collectionCtx.default.slug
	const canonicalUrl = generateCanonicalUrl(canonicalCollectionSlug, slug)

	return (
		<>
			<HashiHead>
				<link rel="canonical" href={canonicalUrl.toString()} key="canonical" />
			</HashiHead>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
				<SidebarSidecarLayout
					headings={layoutProps.headings}
					breadcrumbLinks={layoutProps.breadcrumbLinks}
					sidebarNavDataLevels={layoutProps.navLevels}
					optInOutSlot={<OptInOut platform="learn" />}
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
					<DevDotContent>
						<MDXRemote {...content} components={MDX_COMPONENTS} />
					</DevDotContent>
					<NextPrevious {...nextPreviousData} />
					<FeaturedInCollections
						className={s.featuredInCollections}
						collections={featuredInWithoutCurrent}
					/>
				</SidebarSidecarLayout>
			</InteractiveLabWrapper>
		</>
	)
}

WellArchitectedFrameworkTutorialView.contentType = 'tutorials'
