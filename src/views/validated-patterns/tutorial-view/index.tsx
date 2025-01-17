/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import { Fragment } from 'react'
import InstruqtProvider from 'contexts/instruqt-lab'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import { FeaturedInCollections } from 'views/tutorial-view/components'
import VariantProvider from 'views/tutorial-view/utils/variants/context'
import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { NextPrevious } from 'views/tutorial-view/components'
import { generateCanonicalUrl } from 'views/tutorial-view/utils'
import s from 'views/tutorial-view/tutorial-view.module.css'
import { ValidatedPatternsTutorialViewProps } from '../types'

export default function ValidatedPatternsTutorialView({
	tutorial,
	layoutProps,
	outlineItems,
	pageHeading,
}: ValidatedPatternsTutorialViewProps) {
	const {
		id,
		slug,
		readTime,
		edition,
		productsUsed,
		video,
		handsOnLab,
		content,
		collectionCtx,
		nextPreviousData,
		variant,
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
			<Head>
				<link rel="canonical" href={canonicalUrl.toString()} key="canonical" />
			</Head>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
				<VariantProvider variant={variant}>
					<SidebarSidecarLayout
						sidecarSlot={<OutlineNavWithActive items={outlineItems.slice()} />}
						breadcrumbLinks={layoutProps.breadcrumbLinks}
						sidebarNavDataLevels={layoutProps.navLevels}
						mainWidth="narrow"
						sidecarTopSlot={
							variant ? (
								<VariantDropdownDisclosure variant={variant} isFullWidth />
							) : null
						}
					>
						<TutorialMeta
							heading={pageHeading}
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
						<DevDotContent
							mdxRemoteProps={{ ...content, components: MDX_COMPONENTS }}
						/>
						<NextPrevious {...nextPreviousData} />
						<FeaturedInCollections
							className={s.featuredInCollections}
							collections={featuredInWithoutCurrent}
						/>
					</SidebarSidecarLayout>
				</VariantProvider>
			</InteractiveLabWrapper>
		</>
	)
}
