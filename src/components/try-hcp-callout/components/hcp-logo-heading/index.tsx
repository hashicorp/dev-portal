/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import { useId } from '@react-aria/utils'
import hcpLogo from 'lib/mktg-logos/hcp-horizontal_on-light.svg?include'
import s from './hcp-logo-heading.module.css'

export interface HcpLogoHeadingProps {
	headingText: string
}

/**
 * A card heading component, for use in HCP callout cards
 *
 * Renders the full HCP logo, and renders the provided
 * headingText as visually hidden.
 */
export function HcpLogoHeading({ headingText }: HcpLogoHeadingProps) {
	const uniqueId = useId()
	return (
		<>
			<span id={uniqueId} className="g-screen-reader-only">
				{headingText}
			</span>
			<div aria-labelledby={uniqueId} role="presentation">
				<InlineSvg aria-hidden className={s.hcpLogo} src={hcpLogo} />
			</div>
		</>
	)
}
