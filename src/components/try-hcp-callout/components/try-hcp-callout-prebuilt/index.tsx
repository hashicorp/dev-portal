import { TryHcpCallout } from '..'
import { ProductSlugWithContent } from '../../types'
import { tryHcpCalloutContent } from './content'

/**
 * A wrapper around TryHcpCallout.
 *
 * Handles content for a set of supported `productSlug` value, which allows
 * this component to provide a single-prop `productSlug` props API.
 * Intended for use in authorable contexts.
 */
export function TryHcpCalloutPrebuilt({
	productSlug,
}: {
	productSlug: ProductSlugWithContent
}) {
	const { ctaText, ctaUrl, description, heading } =
		tryHcpCalloutContent[productSlug]
	return (
		<TryHcpCallout
			ctaText={ctaText}
			ctaUrl={ctaUrl}
			description={description}
			heading={heading}
			productSlug={productSlug}
		/>
	)
}
