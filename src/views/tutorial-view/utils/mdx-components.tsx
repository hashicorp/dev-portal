import { ReactNode } from 'react'
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import { makeHeadingElement } from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import Tabs, { Tab } from 'components/tabs'
import ImageConfig from 'components/image-config'
import Image from 'components/image'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import VideoEmbed from 'components/video-embed'
import Text from 'components/text'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import s from './mdx-components.module.css'
import AccordionDisclosure from 'components/accordion-disclosure'
import slugify from 'slugify'

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

/**
 * @TODO
 *   - deprecate string option for collapse
 *   - warn that collapse is `true` by default now?
 *   - pass classname with a margin-top setting for when there are multiple?
 */
const AccordionWrapper = ({ children, collapse, heading }) => {
  return (
    <AccordionDisclosure id={slugify(heading)} title={heading}>
      {children}
    </AccordionDisclosure>
  )
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
