import { Fragment } from 'react'
import Content from '@hashicorp/react-content'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import useCurrentPath from 'hooks/use-current-path'
import {
  Collection as ClientCollection,
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
    | 'readTime'
    | 'productsUsed'
    | 'edition'
    | 'handsOnLab'
    | 'video'
  > {
  collectionCtx: CollectionContext
  content: MDXRemoteSerializeResult
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
 * - fix: the toc overview linking isn't properly aligning
 * - wire up instruqt embed for interactive labs
 * - skeleton out the next / prev component after API endpoint is updated - https://app.asana.com/0/1201903760348480/1201932088801131/f
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
  const isInteractive = Boolean(handsOnLab)
  const InteractiveLabWrapper = isInteractive ? InstruqtProvider : Fragment

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
          isInteractive={Boolean(handsOnLab?.id)}
          hasVideo={Boolean(video?.id)}
          readTime={readTime}
        />
        <Content
          content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
        />
        <div>
          <h2>Next / Prev component</h2>
        </div>
        <FeaturedInCollections collections={collectionCtx.featuredIn} />
      </SidebarSidecarLayout>
    </InteractiveLabWrapper>
  )
}
