import { TryHcpCalloutCompact } from '..'
import { tryHcpCalloutContent, hasHcpCalloutContent } from '../../content'

/**
 * A wrapper around TryHcpCalloutCompact.
 *
 * Handles conditionally rendering HCP callouts only for products with an
 * HCP offering. Also populates the callout with pre-built content.
 */
export function TryHcpCalloutSidecarPlacement({
	productSlug,
}: {
	productSlug: string
}) {
	/**
	 * For products without an HCP offering, or products for which the compact
	 * callout has not yet been design ("hcp"), don't render anything.
	 */
	if (!hasHcpCalloutContent(productSlug) || productSlug === 'hcp') {
		return null
	}

	/**
	 * For all other products, which have an HCP offering and pre-built content,
	 * render the compact callout.
	 */
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
