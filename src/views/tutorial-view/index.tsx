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
import { TutorialSidebar as Sidebar } from './components'
import { getTutorialSlug } from 'views/collection-view/helpers'
import s from './style.module.css'

// @TODO refine this interface once there's a better idea of page needs
export interface TutorialViewProps extends Omit<ClientTutorial, 'content'> {
  content: MDXRemoteSerializeResult
  layout: TutorialSidebarSidecarProps
  currentCollection: ClientCollection
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
  currentCollection,
  readTime,
  productsUsed,
  edition,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layout.breadcrumbLinks}
      sidebarSlot={
        <Sidebar
          title={currentCollection.shortName}
          menuItems={currentCollection.tutorials.map((t) => ({
            title: t.name,
            fullPath: getTutorialSlug(t.slug, currentCollection.slug),
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
      </header>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
      <div>
        <h2>Next / Prev component</h2>
      </div>
      <div>
        <h2>Featured Collections</h2>
      </div>
    </SidebarSidecarLayout>
  )
}
