/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import NextSteps from '@hashicorp/react-next-steps'
import type { NextStepsProps } from '@hashicorp/react-next-steps/types'
import { Products } from '@hashicorp/platform-product-meta'

interface CTA {
	heading: string
	description: string
	cta: string
	link: string
}

interface IoHomePreFooterProps {
	brand: Products
	heading: string
	description: string
	ctas: [CTA] | [CTA, CTA] | [CTA, CTA, CTA]
}

export default function IoHomePreFooter({
	brand,
	heading,
	description,
	ctas,
}: IoHomePreFooterProps) {
	return (
		<NextSteps
			theme={brand}
			heading={heading}
			description={description}
			steps={
				ctas.map((cta: CTA) => {
					return {
						heading: cta.heading,
						description: cta.description,
						cta: {
							title: cta.cta,
							url: cta.link,
						},
					}
				}) as NextStepsProps['steps']
			}
		/>
	)
}
