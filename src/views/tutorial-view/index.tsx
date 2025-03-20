/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { Fragment, useEffect, useRef, useState } from 'react'
import Head from 'next/head'

// Global imports
import { useProgressBatchQuery } from 'hooks/progress/use-progress-batch-query'
import { useTutorialProgressRefs } from 'hooks/progress'
import useCurrentPath from 'hooks/use-current-path'
import { useMobileMenu } from 'contexts'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { TutorialLite } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	CollectionCategorySidebarSection,
	getCollectionSlug,
	getTutorialSlug,
} from 'views/collection-view/helpers'
import { generateCollectionSidebarNavData } from 'views/collection-view/helpers/generate-collection-sidebar-nav-data'
import { getCollectionViewSidebarSections } from 'views/collection-view/server'

import DevDotContent from 'components/dev-dot-content'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
	TutorialViewSidebarContent,
} from 'components/tutorials-sidebar'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import { SignupFormArea } from 'views/certifications/components'

// Local imports
import {
	CollectionContext,
	LayoutContentWrapperProps,
	TutorialData,
	TutorialSidebarSidecarProps,
	TutorialViewProps,
} from './types'
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem, generateCanonicalUrl } from './utils'
import getVideoUrl from './utils/get-video-url'
import VariantProvider from './utils/variants/context'
import { useProgressToast } from './utils/use-progress-toast'
import {
	FeaturedInCollections,
	NextPrevious,
	getNextPrevious,
	FeedbackPanel,
	VariantDropdownDisclosure,
} from './components'
import s from './tutorial-view.module.css'

/**
 * The purpose of this wrapper component is to make it possible to invoke the
 * `useMobileMenu` hook. It cannot be invoked in `TutorialView`. This is because
 * it requires being invoked within a `MobileMenuProvider`.
 *
 * `MobileMenuProvider` is rendered by `CoreDevDotLayout`, which is indirectly
 * rendered by `SidebarSidecarLayout`. This means the `useMobileMenu` hook can
 * only be invoked here by a component rendered within `SidebarSidecarLayout`.
 */
const LayoutContentWrapper = ({
	children,
	collectionCtx,
	product,
	setCollectionViewSidebarSections,
}: LayoutContentWrapperProps) => {
	const { mobileMenuIsOpen } = useMobileMenu()
	const hasLoadedData = useRef(false)

	/**
	 * Only need to load the data once, on the first open of the mobile menu
	 */
	useEffect(() => {
		if (hasLoadedData.current === false && mobileMenuIsOpen) {
			/**
			 * TODO: What should we do if this errors?
			 * https://app.asana.com/0/1202097197789424/1202599138117878/f
			 */
			getCollectionViewSidebarSections(
				product.slug,
				collectionCtx.current
			).then((result: CollectionCategorySidebarSection[]) => {
				hasLoadedData.current = true
				setCollectionViewSidebarSections(result)
			})
		}
	}, [
		collectionCtx,
		mobileMenuIsOpen,
		product,
		setCollectionViewSidebarSections,
	])

	/**
	 * Wrapping in a fragment to prevent a "return type 'ReactNode' is not a valid
	 * JSX element" error
	 */
	return <>{children}</>
}

/**
 * Renders content for tutorial routes.
 *
 * /:productSlug/tutorials/:collectionSlug/:tutorialSlug
 */
function TutorialView({
	layoutProps,
	product,
	tutorial,
	outlineItems,
	pageHeading,
	metadata,
}: TutorialViewProps): React.ReactElement {
	// hooks
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const [collectionViewSidebarSections, setCollectionViewSidebarSections] =
		useState<CollectionCategorySidebarSection[]>(null)
	const { openLab, closeLab, setActive } = useInstruqtEmbed()

	// variables
	const {
		id,
		slug,
		content,
		readTime,
		productsUsed,
		edition,
		handsOnLab,
		video,
		collectionCtx,
	} = tutorial
	const featuredInWithoutCurrent = collectionCtx.featuredIn?.filter(
		(c) => c.id !== collectionCtx.current.id
	)
	const hasVideo = Boolean(video)
	const isInteractive = Boolean(handsOnLab)
	const InteractiveLabWrapper = isInteractive ? Fragment : Fragment
	const nextPreviousData = getNextPrevious({
		currentCollection: collectionCtx.current,
		currentTutorialSlug: slug,
		nextCollectionInSidebar: tutorial.nextCollectionInSidebar,
		formatting: {
			getTutorialSlug,
			getCollectionSlug,
		},
	})

	const canonicalCollectionSlug = tutorial.collectionCtx.default.slug
	const canonicalUrl = generateCanonicalUrl(canonicalCollectionSlug, slug)

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		generateCollectionSidebarNavData(product, layoutProps.sidebarSections),
		{
			levelButtonProps: {
				levelUpButtonText: collectionCtx.current.shortName,
			},
			backToLinkProps: {
				text: collectionCtx.current.shortName,
				href: getCollectionSlug(collectionCtx.current.slug),
			},
			visuallyHideTitle: true,
			children: (
				<TutorialViewSidebarContent
					collection={collectionCtx.current}
					items={collectionCtx.current.tutorials.map((t) =>
						formatTutorialToMenuItem(t, collectionCtx.current, currentPath)
					)}
				/>
			),
		},
	]

	/**
	 * Set up variables for the tutorialId and collectionId, we use these below.
	 * TODO: maybe this isn't necessary, I found it helpful for clarity.
	 */
	const tutorialId = id
	const collectionId = collectionCtx.current.id
	const collectionTutorialIds = collectionCtx.current.tutorials.map(
		(t: TutorialLite) => t.id
	)

	/**
	 * Prime `tutorial` and `collection` progress queries with a batch query.
	 *
	 * This should ideally include all `tutorial` and `collection` entries
	 * we expect to render on the page, so that we only make one progress request.
	 */
	useProgressBatchQuery({
		tutorials: collectionTutorialIds.map((tid) => {
			return {
				tutorialId: tid,
				collectionId,
			}
		}),
		collections: [collectionId],
	})

	/**
	 * Keep track of progress for authenticated users, using span elements.
	 *
	 * Note that we attach `progressRefsId` as `data-ref-id` to avoid some
	 * client-side-navigation-related progress tracking quirks.
	 */
	const progressRefsId = `${id}_${collectionCtx.current.id}`
	const progressRefs = useTutorialProgressRefs({
		tutorialId,
		collectionId,
	})

	/**
	 * Display toast when progress changes to complete.
	 */
	useProgressToast({
		tutorialId,
		collectionId,
		collectionTutorialIds,
	})

	// Handle lab opening/closing when tutorial changes
	useEffect(() => {
		if (isInteractive && handsOnLab?.id) {
			try {
				// Get the current lab state
				const storedState = localStorage.getItem('instruqt-lab-state')
				const currentState = storedState ? JSON.parse(storedState) : null

				// If we're loading a different lab, or there's no current lab
				if (
					!currentState?.storedLabId ||
					currentState.storedLabId !== handsOnLab.id
				) {
					openLab(handsOnLab.id)
				}
				// If it's the same lab, do nothing to preserve the user's open/closed preference
			} catch (e) {
				console.warn('Failed to handle lab state:', e)
			}
		} else if (!isInteractive) {
			// Only close the lab if this tutorial is not interactive
			// This prevents closing the lab when navigating between pages
			closeLab()
		}
	}, [isInteractive, handsOnLab, openLab, closeLab, setActive])

	return (
		<>
			<Head>
				<link rel="canonical" href={canonicalUrl.toString()} key="canonical" />
				{/** Don't index non canonical tutorials */}
				{canonicalUrl.pathname !== currentPath ? (
					<meta name="robots" content="noindex, nofollow" key="robots" />
				) : null}
			</Head>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
				<VariantProvider variant={metadata.variant}>
					<SidebarSidecarLayout
						breadcrumbLinks={layoutProps.breadcrumbLinks}
						sidebarNavDataLevels={sidebarNavDataLevels as any[]}
						showScrollProgress={true}
						AlternateSidebar={TutorialsSidebar}
						sidecarTopSlot={
							metadata.variant ? (
								<VariantDropdownDisclosure
									variant={metadata.variant}
									isFullWidth
								/>
							) : null
						}
						sidecarSlot={
							outlineItems?.length > 0 && (
								<OutlineNavWithActive items={outlineItems} />
							)
						}
						mainWidth={layoutProps.mainWidth}
					>
						<LayoutContentWrapper
							collectionCtx={collectionCtx}
							product={product}
							setCollectionViewSidebarSections={
								setCollectionViewSidebarSections
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
							<span data-ref-id={progressRefsId} ref={progressRefs.startRef} />
							{hasVideo && video.id && !video.videoInline && (
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
							<span data-ref-id={progressRefsId} ref={progressRefs.endRef} />
							<FeedbackPanel />
							<NextPrevious {...nextPreviousData} />
							<FeaturedInCollections
								className={s.featuredInCollections}
								collections={featuredInWithoutCurrent}
							/>
							{layoutProps.isCertificationPrep && (
								<SignupFormArea className={s.newsletterSignupArea} />
							)}
						</LayoutContentWrapper>
					</SidebarSidecarLayout>
				</VariantProvider>
			</InteractiveLabWrapper>
		</>
	)
}

export type {
	TutorialViewProps,
	TutorialData,
	CollectionContext,
	TutorialSidebarSidecarProps,
}
export default TutorialView
