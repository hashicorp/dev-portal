import { MDXRemote } from 'next-mdx-remote'
import TabProvider from 'components/tabs/provider'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import getVideoUrl from 'views/tutorial-view/utils/get-video-url'
import DevDotContent from 'components/dev-dot-content'
import MDX_COMPONENTS from 'views/tutorial-view/utils/mdx-components'
import { FeaturedInCollections } from 'views/tutorial-view/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'
import useCurrentPath from 'hooks/use-current-path'
import { TutorialViewSidebarContent } from 'components/tutorials-sidebar'
import { formatTutorialToMenuItem } from 'views/tutorial-view/utils'
/**
 * TODO
 * - get sidebar / sidecar layout working ✅
 * - get next / prevous data working
 * - make view file
 * - separate out data gen with view logic
 * - check design spec for any inconsistencies
 * - vet the links
 * - check on the tutorial rewrite plugin, to accept waf links
 */

export default function WellArchitectedFrameworkTutorialView({
	tutorial,
	metadata,
	layoutProps,
}) {
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
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
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(metadata.wafName) as SidebarProps,
				{
					title: metadata.wafName,
					levelButtonProps: {
						levelUpButtonText: `Main Menu`,
						levelDownButtonText: 'Previous',
					},
					overviewItemHref: `/${metadata.wafSlug}`,
					menuItems: layoutProps.allWafCollectionSidebarSections,
					showFilterInput: false,
				},
				{
					title: metadata.wafName,
					visuallyHideTitle: true,
					showFilterInput: false,
					levelButtonProps: {
						levelUpButtonText: collectionCtx.current.shortName,
						levelDownButtonText: name,
					},
					backToLinkProps: {
						text: collectionCtx.current.shortName,
						href: `/${collectionCtx.current.slug}`,
					},
					children: (
						<TutorialViewSidebarContent
							items={collectionCtx.current.tutorials.map((t) =>
								formatTutorialToMenuItem(
									t,
									collectionCtx.current.slug,
									currentPath
								)
							)}
						/>
					),
				},
			]}
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
			{/* <NextPrevious {...nextPreviousData} /> */}
			<FeaturedInCollections collections={featuredInWithoutCurrent} />
		</SidebarSidecarLayout>
	)
}
