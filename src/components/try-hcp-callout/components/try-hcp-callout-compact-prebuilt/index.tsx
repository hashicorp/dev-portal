import { TryHcpCalloutCompact } from '..'
import { ProductSlugWithContent } from '../../types'
import { tryHcpCalloutContent } from '../../content'

/**
 * A wrapper around TryHcpCalloutCompact.
 *
 * Handles content for a set of supported `productSlug` value, which allows
 * this component to provide a single-prop `productSlug` props API.
 * Intended for use in author-able contexts.
 */
export function TryHcpCalloutCompactPrebuilt({
	productSlug,
}: {
	productSlug: ProductSlugWithContent
}) {
	const { ctaText, ctaUrl, description, heading } =
		tryHcpCalloutContent[productSlug]
	return (
		<TryHcpCalloutCompact
			ctaText={ctaText}
			ctaUrl={ctaUrl}
			description={description}
			heading={heading}
			productSlug={productSlug}
		/>
	)
}
