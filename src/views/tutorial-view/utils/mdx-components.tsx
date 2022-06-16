// HashiCorp imports
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'

// Global imports
import AccordionDisclosure from 'components/accordion-disclosure'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import Image from 'components/image'
import ImageConfig from 'components/image-config'
import InlineLink from 'components/inline-link'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import { makeHeadingElement } from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import {
  MdxOrderedList,
  MdxUnorderedList,
  MdxListItem,
  MdxTabs,
  MdxTab,
  MdxTable,
} from 'components/dev-dot-content/mdx-components'
import Text from 'components/text'
import VideoEmbed from 'components/video-embed'

const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
  theme: 'dark',
})

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
  Tabs: MdxTabs,
  Tab: MdxTab,
  pre,
  CodeBlockConfig,
  CodeTabs,
  ImageConfig,
  InteractiveLabCallout,
  img: Image,
  VideoEmbed,
  ol: MdxOrderedList,
  ul: MdxUnorderedList,
  li: MdxListItem,
  a: (props) => <InlineLink {...props} textWeight="medium" />,
  h1: (props) => makeHeadingElement(1, props),
  h2: (props) => makeHeadingElement(2, props),
  h3: (props) => makeHeadingElement(3, props),
  h4: (props) => makeHeadingElement(4, props),
  h5: (props) => makeHeadingElement(5, props),
  h6: (props) => makeHeadingElement(6, props),
  p: (props) => <Text {...props} className={devDotStyles.p} />,
  table: MdxTable,
}

export default MDX_COMPONENTS
