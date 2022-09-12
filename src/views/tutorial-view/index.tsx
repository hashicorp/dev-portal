// Third-party imports
import { Fragment, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { MDXRemote } from 'next-mdx-remote'

// Global imports
import { useProgressBatchQuery } from 'hooks/progress/use-progress-batch-query'
import { useTutorialProgressRefs } from 'hooks/progress'
import useCurrentPath from 'hooks/use-current-path'
import { useOptInAnalyticsTracking } from 'hooks/use-opt-in-analytics-tracking'
import { useMobileMenu } from 'contexts'
import InstruqtProvider from 'contexts/instruqt-lab'
import { ProductOption, TutorialLite } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	CollectionCategorySidebarSection,
	getCollectionSlug,
	getTutorialSlug,
} from 'views/collection-view/helpers'
import { getCollectionViewSidebarSections } from 'views/collection-view/server'
import OptInOut from 'components/opt-in-out'
import DevDotContent from 'components/dev-dot-content'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
	CollectionViewSidebarContent,
	TutorialViewSidebarContent,
} from 'components/tutorials-sidebar'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import { getLearnRedirectPath } from 'components/opt-in-out/helpers/get-learn-redirect-path'

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
import { getCanonicalCollectionSlug } from './utils/get-canonical-collection-slug'
import {
	FeaturedInCollections,
	NextPrevious,
	getNextPrevious,
} from './components'
import s from './tutorial-view.module.css'
import { useProgressToast } from './utils/use-progress-toast'

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
}: TutorialViewProps): React.ReactElement {
	// hooks
	useOptInAnalyticsTracking('learn')
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const [collectionViewSidebarSections, setCollectionViewSidebarSections] =
		useState<CollectionCategorySidebarSection[]>(null)

	// variables
	const {
		id,
		name,
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
	const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment
	const nextPreviousData = getNextPrevious({
		currentCollection: collectionCtx.current,
		currentTutorialSlug: slug,
		nextCollectionInSidebar: tutorial.nextCollectionInSidebar,
		formatting: {
			getTutorialSlug,
			getCollectionSlug,
		},
	})

	const canonicalCollectionSlug = getCanonicalCollectionSlug(
		tutorial,
		product.slug
	)
	const canonicalUrl = generateCanonicalUrl(canonicalCollectionSlug, slug)
	const redirectPath = getLearnRedirectPath(
		currentPath,
		slug.split('/')[0] as ProductOption
	)

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			title: 'Tutorials',
			overviewItemHref: `/${product.slug}/tutorials`,
			children: (
				<CollectionViewSidebarContent
					sections={collectionViewSidebarSections}
				/>
			),
		},
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

	return (
		<>
			<Head>
				<link rel="canonical" href={canonicalUrl.toString()} key="canonical" />
			</Head>
			<InteractiveLabWrapper
				key={slug}
				{...(isInteractive && { labId: handsOnLab.id })}
			>
				<SidebarSidecarLayout
					breadcrumbLinks={layoutProps.breadcrumbLinks}
					/**
					 * @TODO remove casting to `any`. Will require refactoring both
					 * `generateTopLevelSidebarNavData` and
					 * `generateProductLandingSidebarNavData` to set up `menuItems` with
					 * the correct types. This will require chaning many files, so
					 * deferring for a follow-up PR since this is functional for the time being.
					 */
					sidebarNavDataLevels={sidebarNavDataLevels as any}
					AlternateSidebar={TutorialsSidebar}
					optInOutSlot={
						<OptInOut platform="learn" redirectPath={redirectPath} />
					}
					headings={layoutProps.headings}
				>
					<LayoutContentWrapper
						collectionCtx={collectionCtx}
						product={product}
						setCollectionViewSidebarSections={setCollectionViewSidebarSections}
					>
						<TutorialMeta
							heading={{ slug: layoutProps.headings[0].slug, text: name }}
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
						<TabProvider>
							<DevDotContent>
								<MDXRemote {...content} components={MDX_COMPONENTS} />
							</DevDotContent>
						</TabProvider>
						<span data-ref-id={progressRefsId} ref={progressRefs.endRef} />
						<NextPrevious {...nextPreviousData} />
						<FeaturedInCollections
							className={s.featuredInCollections}
							collections={featuredInWithoutCurrent}
						/>
					</LayoutContentWrapper>
				</SidebarSidecarLayout>
			</InteractiveLabWrapper>
		</>
	)
}

TutorialView.contentType = 'tutorials'

export type {
	TutorialViewProps,
	TutorialData,
	CollectionContext,
	TutorialSidebarSidecarProps,
}
export default TutorialView
