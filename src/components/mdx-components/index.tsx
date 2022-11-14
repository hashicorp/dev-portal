// HashiCorp imports
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'

// Global imports
import Image, { ImageProps } from 'components/image'
import ImageConfig from 'components/image-config'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import VideoEmbed from 'components/video-embed'
import { useCurrentProduct } from 'contexts'

// Local imports
import { MdxA } from './mdx-a'
import { MdxAccordion } from './mdx-accordion'
import { MdxBlockquote } from './mdx-blockquote'
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 } from './mdx-headings'
import { MdxInlineCode } from './mdx-inline-code'
import { MdxListItem, MdxOrderedList, MdxUnorderedList } from './mdx-lists'
import { MdxP } from './mdx-p'
import { MdxTable } from './mdx-table'
import { MdxTab, MdxTabs } from './mdx-tabs'

const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
	theme: 'dark',
})

//
// Base components need to be slightly modified
// to fit our use cases in dev-portal
//
function EnterpriseAlert(props) {
	const currentProduct = useCurrentProduct()
	return <EnterpriseAlertBase product={currentProduct?.slug} {...props} />
}

/**
 * Returns the Image component configured with specific default behaviour.
 *
 * In /docs, we want to hide image borders by default for now,
 * to match existing behaviour. Note that in /tutorials, we want
 * to show image borders by default. Later we may adjust these
 * defaults; it would likely be ideal for /docs and /tutorials
 * to have the same default behaviour.
 */
function makeImageElement({ noBorder }: { noBorder: ImageProps['noBorder'] }) {
	// eslint-disable-next-line react/display-name
	return ({ alt, src, title }: Pick<ImageProps, 'alt' | 'src' | 'title'>) => (
		<Image alt={alt} src={src} title={title} noBorder={noBorder} />
	)
}

const MDX_COMPONENTS = {
	a: MdxA,
	Accordion: MdxAccordion,
	blockquote: MdxBlockquote,
	CodeBlockConfig,
	CodeTabs,
	EnterpriseAlert,
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	h4: MdxH4,
	h5: MdxH5,
	h6: MdxH6,
	ImageConfig,
	img: makeImageElement({ noBorder: true }),
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
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
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
