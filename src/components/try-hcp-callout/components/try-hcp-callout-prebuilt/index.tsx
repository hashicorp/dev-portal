/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TryHcpCallout } from '..'
import { ProductSlugWithContent } from '../../types'
import { tryHcpCalloutContent } from '../../content'

/**
 * A wrapper around TryHcpCallout.
 *
 * Handles content for a set of supported `productSlug` value, which allows
 * this component to provide a single-prop `productSlug` props API.
 * Intended for use in author-able contexts.
 */
export function TryHcpCalloutPrebuilt({
	productSlug,
}: {
	productSlug: ProductSlugWithContent
}) {
	const { ctaText, ctaUrl, description, heading, image } =
		tryHcpCalloutContent[productSlug]
	return (
		<TryHcpCallout
			ctaText={ctaText}
			ctaUrl={ctaUrl}
			description={description}
			heading={heading}
			productSlug={productSlug}
			image={image}
		/>
	)
}
