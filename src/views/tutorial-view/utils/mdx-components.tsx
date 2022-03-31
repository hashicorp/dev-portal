import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import Tabs, { Tab } from 'components/tabs' // @TODO note that this doesn't support groups yet
import ImageConfig from 'components/image-config'
import Image from 'components/image'
import VideoEmbed from 'components/video-embed'

/**
 * @TODO move over these components from learn, update to new spec
 *
 * import Accordion from 'components/accordion'
 * import VideoEmbed from 'components/video-embed'
 * import ImageConfig from 'components/image-config'
 * import InteractiveLabCallout from 'components/lab-callout'
 */

const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
  theme: 'dark',
})

//  these components are automatically imported into scope within MDX content
const MDX_COMPONENTS = {
  Tabs,
  Tab,
  pre,
  CodeBlockConfig,
  CodeTabs,
  ImageConfig,
  img: Image,
  VideoEmbed,
}

export default MDX_COMPONENTS
