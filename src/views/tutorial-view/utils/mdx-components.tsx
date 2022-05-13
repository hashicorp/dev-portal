import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import Tabs, { Tab } from 'components/tabs'
import ImageConfig from 'components/image-config'
import Image from 'components/image'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import VideoEmbed from 'components/video-embed'
import { ReactNode } from 'react'
import s from './mdx-components.module.css'

/**
 * @TODO move over these components from learn, update to new spec
 *
 * import Accordion from 'components/accordion'
 */

const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
  theme: 'dark',
})

/**
 * In docs, we've renamed the `defaultTabIdx` prop to `initialActiveIndex`.
 * This option has no known current use in learn, so is being ignored for now.
 * If we were instead to pass Tabs directly, authors might start using
 * the renamed initialTabIndex prop, which would cause inconsistency with
 * docs.
 */
function TabsWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={s.tabsWrapper}>
      <Tabs>{children}</Tabs>
    </div>
  )
}

//  these components are automatically imported into scope within MDX content
const MDX_COMPONENTS = {
  Tabs: TabsWrapper,
  Tab,
  pre,
  CodeBlockConfig,
  CodeTabs,
  ImageConfig,
  InteractiveLabCallout,
  img: Image,
  VideoEmbed,
}

export default MDX_COMPONENTS
