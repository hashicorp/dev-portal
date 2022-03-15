import Content from '@hashicorp/react-content'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { TutorialFullCollectionCtx as ClientTutorial } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import MDX_COMPONENTS from './utils/mdx-components'

export interface TutorialViewProps extends Omit<ClientTutorial, 'content'> {
  content: MDXRemoteSerializeResult
}

// @TODO update this interface once we have a better idea of the page needs
export default function TutorialView({
  name,
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
      <h1>{name}</h1>
      <Content
        content={<MDXRemote {...content} components={MDX_COMPONENTS} />}
      />
    </SidebarSidecarLayout>
  )
}
