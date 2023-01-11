// Global imports
import AccordionDisclosure from 'components/accordion-disclosure'
import Image from 'components/image'
import ImageConfig from 'components/image-config'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import {
	MdxA,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxTabs,
	MdxTab,
	MdxTable,
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
	MdxP,
	MdxInlineCode,
	MdxBlockquote,
	MdxTryHcpCallout,
	MdxTip,
	MdxHighlight,
	MdxNote,
	MdxWarning,
	MdxCodeTabs,
	MdxPre,
	MdxCodeBlockConfig,
} from 'components/dev-dot-content/mdx-components'
import VideoEmbed from 'components/video-embed'

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
	pre: MdxPre,
	inlineCode: MdxInlineCode,
	CodeBlockConfig: MdxCodeBlockConfig,
	CodeTabs: MdxCodeTabs,
	ImageConfig,
	InteractiveLabCallout,
	img: Image,
	VideoEmbed,
	ol: MdxOrderedList,
	ul: MdxUnorderedList,
	li: MdxListItem,
	a: MdxA,
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	h4: MdxH4,
	h5: MdxH5,
	h6: MdxH6,
	p: MdxP,
	table: MdxTable,
	blockquote: MdxBlockquote,
	TryHcpCallout: MdxTryHcpCallout,
	Tip: MdxTip,
	Highlight: MdxHighlight,
	Note: MdxNote,
	Warning: MdxWarning,
}

export default MDX_COMPONENTS
