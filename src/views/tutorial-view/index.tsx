import Content from '@hashicorp/react-content'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { TutorialFullCollectionCtx as ClientTutorial } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import MDX_COMPONENTS from './utils/mdx-components'
import Heading from 'components/heading'

export interface TutorialViewProps extends Omit<ClientTutorial, 'content'> {
  content: MDXRemoteSerializeResult
}

// @TODO update this interface once we have a better idea of the page needs
export default function TutorialView({
  name,
  slug,
  content,
}: TutorialViewProps): React.ReactElement {
  return (
    <SidebarSidecarLayout
      sidebarSlot={
        <>
          {new Array(20).fill(null).map((_) => (
            <div key={_}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              eros diam, fringilla ac malesuada vel, faucibus quis mauris.
            </div>
          ))}
        </>
      }
      sidecarSlot={
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          eros diam, fringilla ac malesuada vel, faucibus quis mauris.
        </div>
      }
    >
      <Heading level={1} size={500} weight="bold" slug={slug}>
        {name}
      </Heading>
      <p>Read time, products used etc.</p>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
    </SidebarSidecarLayout>
  )
}
