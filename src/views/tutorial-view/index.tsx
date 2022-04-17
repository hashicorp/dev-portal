import { Fragment } from 'react'
import Head from 'next/head'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
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
import { generateCanonicalUrl } from './utils'
import {
  FeaturedInCollections,
  CollectionCardProps,
  NextPrevious,
  getNextPrevious,
} from './components'
import getVideoUrl from './utils/get-video-url'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import s from './tutorial-view.module.css'

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
  default: Pick<ClientCollection, 'slug' | 'id'>
  current: ClientCollection
  featuredIn?: CollectionCardProps[]
}

export type TutorialSidebarSidecarProps = Required<
  Pick<
    SidebarSidecarLayoutProps,
    'children' | 'headings' | 'breadcrumbLinks' | 'sidebarProps'
  >
>

export default function TutorialView({
  layout,
  tutorial,
}: TutorialViewProps): React.ReactElement {
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
  const canonicalUrl = generateCanonicalUrl(collectionCtx.default.slug, slug)

  return (
    <>
      <Head>
        <title>{name}</title>
        <link rel="canonical" href={canonicalUrl.toString()} />
      </Head>
      <InteractiveLabWrapper
        key={slug}
        {...(isInteractive && { labId: handsOnLab.id })}
      >
        <SidebarSidecarLayout
          breadcrumbLinks={layout.breadcrumbLinks}
          headings={layout.headings}
          sidebarProps={layout.sidebarProps}
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
            collections={collectionCtx.featuredIn}
          />
        </SidebarSidecarLayout>
      </InteractiveLabWrapper>
    </>
  )
}
