/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global imports
import AccordionDisclosure from 'components/accordion-disclosure'
import Image from 'components/image'
import InteractiveLabCallout from 'components/interactive-lab-callout'
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
	InteractiveLabCallout,
	img: Image,
	VideoEmbed,
}

export default MDX_COMPONENTS
