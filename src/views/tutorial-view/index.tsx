import { Fragment } from 'react'
import Content from '@hashicorp/react-content'
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
import TutorialMeta from 'components/tutorial-meta'

export interface TutorialViewProps {
  tutorial: TutorialData
  layout: TutorialSidebarSidecarProps
}

export interface TutorialData
  extends Pick<
    ClientTutorial,
    | 'name'
    | 'slug'
    | 'description'
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
    description,
    content,
    readTime,
    productsUsed,
    edition,
    handsOnLab,
    video,
    collectionCtx,
  } = tutorial
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
            description,
            edition,
            productsUsed,
            isInteractive: Boolean(handsOnLab),
            hasVideo: Boolean(video),
          }}
        />
        <Content
          content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
        />
        <NextPrevious {...nextPreviousData} />
        <FeaturedInCollections collections={collectionCtx.featuredIn} />
      </SidebarSidecarLayout>
    </InteractiveLabWrapper>
  )
}
