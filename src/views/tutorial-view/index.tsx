// Third-party imports
import { Fragment } from 'react'
import Head from 'next/head'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

// Global imports
import useCurrentPath from 'hooks/use-current-path'
import {
  Collection as ClientCollection,
  CollectionLite as ClientCollectionLite,
  TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import SidebarSidecarLayout, {
  SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import {
  CollectionCategorySidebarSection,
  getCollectionSlug,
} from 'views/collection-view/helpers'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import DevDotContent from 'components/dev-dot-content'
import TutorialsSidebar, {
  HorizontalRule,
  SectionList,
  SectionTitle,
} from 'components/tutorials-sidebar'
import TutorialMeta from 'components/tutorial-meta'
import VideoEmbed from 'components/video-embed'
import InstruqtProvider from 'contexts/instruqt-lab'
import { useCurrentProduct } from 'contexts'

// Local imports
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem, generateCanonicalUrl } from './utils'
import {
  FeaturedInCollections,
  CollectionCardProps,
  NextPrevious,
  getNextPrevious,
} from './components'
import getVideoUrl from './utils/get-video-url'
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
    'children' | 'headings' | 'breadcrumbLinks'
  > & { collectionViewSidebarSections: CollectionCategorySidebarSection[] }
>

export default function TutorialView({
  layout,
  tutorial,
}: TutorialViewProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
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

  // TODO: this is long, refactor
  const sidebarNavDataLevels = [
    {
      menuItems: generateTopLevelSidebarNavData(),
      showFilterInput: false,
      title: 'Main Menu',
    },
    {
      title: 'Tutorials',
      children: [
        <>
          <SectionList
            items={[
              {
                text: 'Overview',
                href: `/${currentProduct.slug}/tutorials`,
                isActive: currentPath === `/${currentProduct.slug}/tutorials`,
              },
            ]}
          />
          {layout.collectionViewSidebarSections.map(
            (section: CollectionCategorySidebarSection) => {
              return (
                <>
                  <HorizontalRule />
                  <SectionTitle text={section.title} />
                  <SectionList items={section.items} />
                </>
              )
            }
          )}
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
        </>,
      ],
    },
    {
      backToLinkProps: {
        text: collectionCtx.current.shortName,
        href: getCollectionSlug(collectionCtx.current.slug),
      },
      visuallyHideTitle: true,
      children: [
        <>
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
        </>,
      ],
    },
  ]

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
          sidebarNavDataLevels={sidebarNavDataLevels as any[]}
          SidebarSlot={TutorialsSidebar}
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
