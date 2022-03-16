import Content from '@hashicorp/react-content'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
  Collection as ClientCollection,
  TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import SidebarSidecarLayout, {
  SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import Heading from 'components/heading'
import MDX_COMPONENTS from './utils/mdx-components'
import { formatTutorialToMenuItem } from './utils'
import {
  TutorialSidebar as Sidebar,
  FeaturedInCollections,
  CollectionCardProps,
} from './components'

export interface TutorialViewProps
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
  layout: TutorialSidebarSidecarProps
}

export type CollectionContext = {
  isDefault: boolean
  current: ClientCollection
  featuredIn?: CollectionCardProps[]
}

export type TutorialSidebarSidecarProps = Pick<
  SidebarSidecarLayoutProps,
  'children' | 'headings' | 'breadcrumbLinks'
>

/**
 *
 * Outstanding @TODOs
 * - add canonical url if this is the default collection
 * - fix: the toc overview linking isn't properly aligning
 * - wire up instruqt embed for interactive labs
 * - skeleton out the next / prev component after API endpoint is updated - https://app.asana.com/0/1201903760348480/1201932088801131/f
 */

// @TODO add canonical url if this is the default collection
export default function TutorialView({
  name,
  slug,
  content,
  layout,
  readTime,
  productsUsed,
  edition,
  handsOnLab,
  video,
  collectionCtx,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layout.breadcrumbLinks}
      sidebarSlot={
        <Sidebar
          title={collectionCtx.current.shortName}
          menuItems={collectionCtx.current.tutorials.map((t) =>
            formatTutorialToMenuItem(t, collectionCtx.current.slug)
          )}
        />
      }
      sidecarSlot={<TableOfContents headings={layout.headings} />}
    >
      <header id="overview">
        <Heading level={1} size={500} weight="bold" slug={slug}>
          {name}
        </Heading>
        <div>
          <h2>Badges Stub</h2>
          <p>Read time: {readTime} min</p>
          <p>Products used: {productsUsed.map((p) => p.product.name)}</p>
          <p>Edition: {edition}</p>
          <p>Video: {`${Boolean(video?.id)}`}</p>
          <p>Interactive Lab: {`${Boolean(handsOnLab?.id)}`}</p>
        </div>
        {handsOnLab?.id ? <button>Show Terminal</button> : null}
      </header>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
      <div>
        <h2>Next / Prev component</h2>
      </div>
      <FeaturedInCollections collections={collectionCtx.featuredIn} />
    </SidebarSidecarLayout>
  )
}
