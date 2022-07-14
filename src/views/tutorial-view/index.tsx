// Third-party imports
import { Fragment, useRef, useState } from 'react'
import Head from 'next/head'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

// Global imports
import { LearnProductData } from 'types/products'
import useCurrentPath from 'hooks/use-current-path'
import { useOptInAnalyticsTracking } from 'hooks/use-opt-in-analytics-tracking'
import { useMobileMenu } from 'contexts'
import InstruqtProvider from 'contexts/instruqt-lab'
import {
	Collection as ClientCollection,
	CollectionLite as ClientCollectionLite,
	ProductOption,
	TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import {
	CollectionCategorySidebarSection,
	getCollectionSlug,
} from 'views/collection-view/helpers'
import { getCollectionViewSidebarSections } from 'views/collection-view/server'
import OptInOut from 'components/opt-in-out'
import { CollectionCardPropsWithId } from 'components/collection-card'
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
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem, generateCanonicalUrl } from './utils'
import {
	FeaturedInCollections,
	NextPrevious,
	getNextPrevious,
} from './components'
import getVideoUrl from './utils/get-video-url'
import { getCanonicalCollectionSlug } from './utils/get-canonical-collection-slug'
import s from './tutorial-view.module.css'

export interface TutorialViewProps {
	layoutProps: TutorialSidebarSidecarProps
	product: LearnProductData
	tutorial: TutorialData
}

export interface TutorialData
	extends Pick<
		ClientTutorial,
		| 'name'
		| 'slug'
		| 'readTime'
		| 'productsUsed'
		| 'edition'
		| 'handsOnLab'
		| 'video'
	> {
	collectionCtx: CollectionContext
	content: MDXRemoteSerializeResult
	nextCollectionInSidebar?: ClientCollectionLite
}

export type CollectionContext = {
	default: Pick<ClientCollection, 'slug' | 'id'>
	current: ClientCollection
	featuredIn?: CollectionCardPropsWithId[]
}

export type TutorialSidebarSidecarProps = Required<
	Pick<
		SidebarSidecarLayoutProps,
		'children' | 'headings' | 'breadcrumbLinks'
	> & { sidebarSections: CollectionCategorySidebarSection[] }
>

const LayoutContentWrapper = ({
	children,
	collectionCtx,
	product,
	setCollectionViewSidebarSections,
}) => {
	const { mobileMenuIsOpen } = useMobileMenu()
	const haveLoadedData = useRef(false)

	if (mobileMenuIsOpen && haveLoadedData.current === false) {
		getCollectionViewSidebarSections(product, collectionCtx.current).then(
			(result) => {
				haveLoadedData.current = true
				setCollectionViewSidebarSections(result)
			}
		)
	}

	return children
}

export default function TutorialView({
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
						formatTutorialToMenuItem(t, collectionCtx.current.slug, currentPath)
					)}
				/>
			),
		},
	]

	return (
		<>
			<Head>
				<link rel="canonical" href={canonicalUrl.toString()} />
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
					 * `generateProductLandingSidebarNavData` to set up `menuItems` with the
					 * correct types. This will require chaning many files, so deferring for
					 * a follow-up PR since this is functional for the time being.
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
						/>
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
