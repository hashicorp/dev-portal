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

// @TODO refine this interface once there's a better idea of page needs
export interface TutorialViewProps extends Omit<ClientTutorial, 'content'> {
  content: MDXRemoteSerializeResult
  layout: TutorialSidebarSidecarProps
  currentCollection: ClientCollection
}
type TutorialSidebarSidecarProps = Pick<
  SidebarSidecarLayoutProps,
  'children' | 'headings' | 'breadcrumbLinks'
>

// @TODO add canonical url for the default collection - at the page level?
export default function TutorialView({
  name,
  slug,
  content,
  layout,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layout.breadcrumbLinks}
      sidebarSlot={<Sidebar />}
      sidecarSlot={<TableOfContents headings={layout.headings} />}
    >
      <header id="overview">
        <Heading level={1} size={500} weight="bold" slug={slug}>
          {name}
        </Heading>
        <p>Read time, products used etc.</p>
      </header>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
    </SidebarSidecarLayout>
  )
}
