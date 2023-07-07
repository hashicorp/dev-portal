/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global imports
import { MdxAccordion } from 'components/dev-dot-content/mdx-components'
import Image from 'components/image'
import InteractiveLabCallout from 'components/interactive-lab-callout'
import VideoEmbed from 'components/video-embed'
import { MdxVariant } from './variants/mdx-variant'

//  these components are automatically imported into scope within MDX content
const MDX_COMPONENTS = {
	Accordion: MdxAccordion,
	InteractiveLabCallout,
	img: Image,
	Variant: MdxVariant,
	VideoEmbed,
}

export default MDX_COMPONENTS
