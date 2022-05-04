import { Fragment } from 'react'
import Head from 'next/head'
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
import TabProvider from 'components/tabs/provider'
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem, generateCanonicalUrl } from './utils'
import {
  FeaturedInCollections,
  NextPrevious,
  getNextPrevious,
} from './components'
import { CollectionCardPropsWithId } from 'components/collection-card'
import { getCollectionSlug } from 'views/collection-view/helpers'
import TutorialsSidebar, {
  HorizontalRule,
  SectionList,
  SectionTitle,
} from 'components/tutorials-sidebar'
import { OptOutButton } from 'views/product-tutorials-view/components/learn-opt-out-button'
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
  featuredIn?: CollectionCardPropsWithId[]
}

export type TutorialSidebarSidecarProps = Required<
  Pick<SidebarSidecarLayoutProps, 'children' | 'headings' | 'breadcrumbLinks'>
>

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
          optOutButtonSlot={<OptOutButton />}
          sidebarSlot={
            <TutorialsSidebar
              backToLinkProps={{
                text: collectionCtx.current.shortName,
                href: getCollectionSlug(collectionCtx.current.slug),
              }}
              title={`${collectionCtx.current.shortName} Collection`}
              visuallyHideTitle={true}
            >
              <SectionList
                items={collectionCtx.current.tutorials.map((t) =>
                  formatTutorialToMenuItem(
                    t,
                    collectionCtx.current.slug,
                    currentPath
                  )
                )}
              />
              <HorizontalRule />
              <SectionTitle text="Resources" />
              <SectionList
                items={[
                  {
                    text: 'All Tutorials',
                    href: 'https://learn.hashicorp.com',
                  },
                  {
                    text: 'Community Forum',
                    href: 'https://discuss.hashicorp.com',
                  },
                  { text: 'Support', href: 'https://support.hashicorp.com' },
                  { text: 'GitHub', href: 'http://github.com/hashicorp' },
                ]}
              />
            </TutorialsSidebar>
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
            collections={collectionCtx.featuredIn}
          />
        </SidebarSidecarLayout>
      </InteractiveLabWrapper>
    </>
  )
}
