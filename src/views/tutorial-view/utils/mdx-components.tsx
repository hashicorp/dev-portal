// Third-party imports
import { ReactNode } from 'react'

// HashiCorp imports
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'

// Global imports
import { makeHeadingElement } from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import AccordionDisclosure from 'components/accordion-disclosure'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import Image from 'components/image'
import ImageConfig from 'components/image-config'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import VideoEmbed from 'components/video-embed'

// Local imports
import s from './mdx-components.module.css'

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

/**
 * @TODO
 *   - deprecate string option for collapse
 *   - warn that collapse is `true` by default now?
 *   - pass classname with a margin-top setting for when there are multiple?
 */
const AccordionWrapper = ({ children, collapse, heading }) => {
  return <AccordionDisclosure title={heading}>{children}</AccordionDisclosure>
}

//  these components are automatically imported into scope within MDX content
const MDX_COMPONENTS = {
  Accordion: AccordionWrapper,
  Tabs: TabsWrapper,
  Tab,
  pre,
  CodeBlockConfig,
  CodeTabs,
  ImageConfig,
  InteractiveLabCallout,
  img: Image,
  VideoEmbed,
  h1: (props) => makeHeadingElement(1, props),
  h2: (props) => makeHeadingElement(2, props),
  h3: (props) => makeHeadingElement(3, props),
  h4: (props) => makeHeadingElement(4, props),
  h5: (props) => makeHeadingElement(5, props),
  h6: (props) => makeHeadingElement(6, props),
  p: (props) => <Text {...props} className={devDotStyles.p} />,
}

export default MDX_COMPONENTS
