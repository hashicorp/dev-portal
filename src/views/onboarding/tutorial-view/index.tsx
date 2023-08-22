/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Fragment } from 'react'
import HashiHead from '@hashicorp/react-head'
import InstruqtProvider from 'contexts/instruqt-lab'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import { NextPrevious } from 'views/tutorial-view/components'
import VariantProvider from 'views/tutorial-view/utils/variants/context'
import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import { OnboardingTutorialViewProps } from '../types'
import { getTutorialSlug } from 'views/collection-view/helpers'

export default function OnboardingTutorialView({
	tutorial,
	layoutProps,
	pageHeading,
	outlineItems,
}: OnboardingTutorialViewProps) {
	const {
		id,
		slug,
		readTime,
		edition,
		productsUsed,
		video,
		handsOnLab,
		content,
		nextPreviousData,
		variant,
	} = tutorial
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment

	/**
	 * We use the tutorialsBasePath to construct variant URLs.
	 *
	 * TODO: write up more details on this, feels like this approach
	 * could have other implications on tutorial variant context
	 */
	const tutorialBasePath = getTutorialSlug(
		tutorial.slug,
		tutorial.collectionCtx.current.slug
	)

	return (
		<>
			<HashiHead>
				<meta name="robots" content="noindex, nofollow" />
			</HashiHead>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
				<VariantProvider variant={variant}>
					<SidebarSidecarLayout
						sidecarSlot={<OutlineNavWithActive items={outlineItems.slice(0)} />}
						breadcrumbLinks={layoutProps.breadcrumbLinks}
						sidebarNavDataLevels={layoutProps.navLevels}
						sidecarTopSlot={
							variant ? (
								<VariantDropdownDisclosure
									variant={variant}
									isFullWidth
									tutorialBasePath={tutorialBasePath}
								/>
							) : null
						}
					>
						<TutorialMeta
							tutorialBasePath={tutorialBasePath}
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
					</SidebarSidecarLayout>
				</VariantProvider>
			</InteractiveLabWrapper>
		</>
	)
}
