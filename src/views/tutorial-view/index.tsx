import Content from '@hashicorp/react-content'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { TutorialFullCollectionCtx as ClientTutorial } from 'lib/learn-client/types'
import SidebarSidecarLayout, {
  SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import MDX_COMPONENTS from './utils/mdx-components'
import Heading from 'components/heading'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'

export interface TutorialViewProps extends Omit<ClientTutorial, 'content'> {
  content: MDXRemoteSerializeResult
  layout: TutorialSidebarSidecarProps
}
type TutorialSidebarSidecarProps = Pick<
  SidebarSidecarLayoutProps,
  'children' | 'headings' | 'breadcrumbLinks'
>

// @TODO update this interface once we have a better idea of the page needs
export default function TutorialView({
  name,
  slug,
  content,
  layout,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layout.breadcrumbLinks}
      sidebarSlot={
        <>
          {new Array(5).fill(null).map((_) => (
            <div key={_}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          ))}
        </>
      }
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
