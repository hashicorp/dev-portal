import { Redirect } from 'next'
import { ProductSlug } from 'types/products'

/**
 * Return a redirect to the latest URL for a { productSlug, integrationSlug }
 * pair. Intended for use in getStaticProps, where we may want to automatically
 * redirect to the canonical latest URL in some cases.
 */
export function getLatestRedirect({
	productSlug,
	integrationSlug,
}: {
	productSlug: ProductSlug
	integrationSlug: string
}): { redirect: Redirect } {
	return {
		redirect: {
			destination: `/${productSlug}/integrations/${integrationSlug}`,
			// Not permanent as a new release in the future will turn the
			// latest release into an older release which should render!
			permanent: false,
		},
	}
}
