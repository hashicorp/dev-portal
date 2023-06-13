/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { useVariant } from './context'
import { TutorialVariantOption } from './types'

interface MdxVariantProps {
	slug: string // the variant slug
	option: string // the variant option slug
	children: ReactElement
}

export function MdxVariant({ slug, option, children }: MdxVariantProps) {
	const { currentVariant } = useVariant()
	if (!currentVariant) {
		return null
	}
	const shouldRenderContent =
		currentVariant.slug === slug && currentVariant.activeOption.slug === option
	const isValidVariantOption = currentVariant.options.find(
		(o: TutorialVariantOption) => o.slug === option
	)

	if (!isValidVariantOption) {
		throw new Error(
			`[mdx-variant]: Option not valid for variant: '${slug}'. Please pass one of the available options — ${currentVariant.options
				.map((o: TutorialVariantOption) => o.slug)
				.join(', ')}`
		)
	}

	return shouldRenderContent ? children : null
}
