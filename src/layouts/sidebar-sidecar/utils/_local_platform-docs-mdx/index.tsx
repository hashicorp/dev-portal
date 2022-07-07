import React from 'react'
import codeBlockPrimitives from '@hashicorp/react-code-block/mdx'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import { useCurrentProduct } from 'contexts'
import {
	MdxA,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxTab,
	MdxTabs,
	MdxTable,
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
} from 'components/dev-dot-content/mdx-components'
import Text from 'components/text'
import Image from 'components/image'
import devDotStyles from 'components/dev-dot-content/dev-dot-content.module.css'
import { ImageProps } from 'components/image/types'

// This function returns a simple object containing the default components
// The `additionalComponents` param is purely for convenience.
// It is intended for use with `next-mdx-remote`.
export default function defaultMdxComponents({ additionalComponents = {} }) {
	return Object.assign(_defaultComponents(), additionalComponents)
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

// Purely for sharing between the two functions. Once `createMdxProvider` is
// deprecated, this can be moved inline.
function _defaultComponents() {
	const { CodeBlockConfig, CodeTabs, pre } = codeBlockPrimitives({
		theme: 'dark',
	})
	return {
		Tabs: MdxTabs,
		Tab: MdxTab,
		EnterpriseAlert,
		CodeBlockConfig,
		CodeTabs,
		pre,
		a: MdxA,
		ol: MdxOrderedList,
		ul: MdxUnorderedList,
		li: MdxListItem,
		img: makeImageElement({ noBorder: true }),
		h1: MdxH1,
		h2: MdxH2,
		h3: MdxH3,
		h4: MdxH4,
		h5: MdxH5,
		h6: MdxH6,
		p: (props) => <Text {...props} className={devDotStyles.p} />,
		table: MdxTable,
	}
}

//
// Base components need to be slightly modified
// to fit our use cases in dev-portal
//
function EnterpriseAlert(props) {
	const currentProduct = useCurrentProduct()
	return <EnterpriseAlertBase product={currentProduct?.slug} {...props} />
}
