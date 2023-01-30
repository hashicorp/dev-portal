import { TryHcpCallout } from '..'
import { ProductSlugWithContent } from '../../types'
import { tryHcpCalloutContent } from '../../content'
import { useABTestCta } from '../a-b-test'

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
	const { ctaText, ctaUrl, description, heading } =
		tryHcpCalloutContent[productSlug]
	const trialCtaText = useABTestCta(ctaText)
	return (
		<TryHcpCallout
			ctaText={trialCtaText}
			ctaUrl={ctaUrl}
			description={description}
			heading={heading}
			productSlug={productSlug}
		/>
	)
}
