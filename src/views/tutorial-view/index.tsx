import { Fragment } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import useCurrentPath from 'hooks/use-current-path'
import {
  Collection as ClientCollection,
  CollectionLite as ClientCollectionLite,
  TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import SidebarSidecarLayout, {
  SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import DevDotContent from 'components/dev-dot-content'
import InstruqtProvider from 'contexts/instruqt-lab'
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem } from './utils'
import {
  TutorialSidebar as Sidebar,
  FeaturedInCollections,
  CollectionCardProps,
  NextPrevious,
  getNextPrevious,
} from './components'
import getVideoUrl from './utils/get-video-url'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'

export interface TutorialViewProps {
  tutorial: TutorialData
  layout: TutorialSidebarSidecarProps
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
  isDefault: boolean
  current: ClientCollection
  featuredIn?: CollectionCardProps[]
}

export type TutorialSidebarSidecarProps = Required<
  Pick<SidebarSidecarLayoutProps, 'children' | 'headings' | 'breadcrumbLinks'>
>

/**
 *
 * Outstanding @TODOs
 * - add canonical url if this is the default collection
 */

export default function TutorialView({
  layout,
  tutorial,
}: TutorialViewProps): React.ReactElement {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
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
  const hasVideo = Boolean(video)
  const isInteractive = Boolean(handsOnLab)
  const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment
  const nextPreviousData = getNextPrevious({
    currentCollection: collectionCtx.current,
    currentTutorialSlug: slug,
    nextCollectionInSidebar: tutorial.nextCollectionInSidebar,
  })

  return (
    <InteractiveLabWrapper
      key={slug}
      {...(isInteractive && { labId: handsOnLab.id })}
    >
      <SidebarSidecarLayout
        breadcrumbLinks={layout.breadcrumbLinks}
        sidebarSlot={
          <Sidebar
            title={collectionCtx.current.shortName}
            menuItems={collectionCtx.current.tutorials.map((t) =>
              formatTutorialToMenuItem(
                t,
                collectionCtx.current.slug,
                currentPath
              )
            )}
          />
        }
        headings={layout.headings}
      >
        <TutorialMeta
          heading={{ slug: layout.headings[0].slug, text: name }}
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
            url={getVideoUrl({ videoId: video.id, videoHost: video.videoHost })}
          />
        )}
        <DevDotContent>
          <MDXRemote {...content} components={MDX_COMPONENTS} />
        </DevDotContent>
        <NextPrevious {...nextPreviousData} />
        <FeaturedInCollections collections={collectionCtx.featuredIn} />
      </SidebarSidecarLayout>
    </InteractiveLabWrapper>
  )
}
