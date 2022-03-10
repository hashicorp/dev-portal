import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import { Tab } from '@hashicorp/react-tabs'
import Tabs from 'components/tabs'
// import Accordion from 'components/accordion'
// import { LabToggleButton } from 'components/lab-embed'
// import VideoEmbed from 'components/video-embed'
// import ImageConfig from 'components/image-config'
// import InteractiveLabCallout from 'components/lab-callout'

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
}

export default MDX_COMPONENTS
