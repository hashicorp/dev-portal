// HashiCorp imports
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'

// Global imports
import ImageConfig from 'components/image-config'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import VideoEmbed from 'components/video-embed'

// Local imports
import { MdxA } from './mdx-a'
import { MdxAccordion } from './mdx-accordion'
import { MdxBlockquote } from './mdx-blockquote'
import { MdxEnterpriseAlert } from './mdx-enterprise-alert'
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 } from './mdx-headings'
import { MdxImage } from './mdx-image'
import { MdxInlineCode } from './mdx-inline-code'
import { MdxListItem, MdxOrderedList, MdxUnorderedList } from './mdx-lists'
import { MdxP } from './mdx-p'
import { MdxTable } from './mdx-table'
import { MdxTab, MdxTabs } from './mdx-tabs'

const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
	theme: 'dark',
})

const MDX_COMPONENTS = {
	a: MdxA,
	Accordion: MdxAccordion,
	blockquote: MdxBlockquote,
	CodeBlockConfig,
	CodeTabs,
	EnterpriseAlert: MdxEnterpriseAlert,
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	h4: MdxH4,
	h5: MdxH5,
	h6: MdxH6,
	ImageConfig,
	img: MdxImage,
	inlineCode: MdxInlineCode,
	InteractiveLabCallout,
	li: MdxListItem,
	ol: MdxOrderedList,
	p: MdxP,
	pre,
	Tab: MdxTab,
	table: MdxTable,
	Tabs: MdxTabs,
	ul: MdxUnorderedList,
	VideoEmbed,
}

export {
	MdxA,
	MdxAccordion,
	MdxBlockquote,
	MdxEnterpriseAlert,
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
	MdxImage,
	MdxInlineCode,
	MdxListItem,
	MdxOrderedList,
	MdxP,
	MdxTab,
	MdxTable,
	MdxTabs,
	MdxUnorderedList,
}
export default MDX_COMPONENTS
