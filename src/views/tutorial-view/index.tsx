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
import {
  TutorialSidebar as Sidebar,
  FeaturedInCollections,
  CollectionCardProps,
} from './components'

import { getTutorialSlug } from 'views/collection-view/helpers'

// @TODO refine this interface once there's a better idea of page needs
export interface TutorialViewProps
  extends Pick<
    ClientTutorial,
    'name' | 'slug' | 'readTime' | 'productsUsed' | 'edition' | 'handsOnLab'
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

// @TODO add canonical url for the default collection - at the page level?
export default function TutorialView({
  name,
  slug,
  content,
  layout,

  readTime,
  productsUsed,
  edition,
  handsOnLab,
  collectionCtx,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layout.breadcrumbLinks}
      sidebarSlot={
        <Sidebar
          title={collectionCtx.current.shortName}
          menuItems={collectionCtx.current.tutorials.map((t) => ({
            title: t.name,
            fullPath: getTutorialSlug(t.slug, collectionCtx.current.slug),
            id: t.id,
          }))}
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
        </div>
        {/** Need to wire up instruqt embed */}
        {handsOnLab?.id ? <button>Show Terminal</button> : null}
      </header>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
      <div>
        {/**
         * Waiting on an api endpoint for this
         * could do basic logic though unless its the last one
         * */}
        <h2>Next / Prev component</h2>
      </div>
      <div>
        <FeaturedInCollections collections={collectionCtx.featuredIn} />
      </div>
    </SidebarSidecarLayout>
  )
}
