import { ProductSlug } from 'types/products'
import { isProductSlug } from 'lib/products'

/**
 * Given a "product" slug from a Tutorials context,
 * such as in part of a collection or tutorial slug,
 * Return a "product" slug compatible with Dev Dot's ProductSlug type.
 *
 * This is very specifically targeted at normalizing "cloud" to "hcp".
 * In Tutorials contexts, we use "cloud"; in Dev Dot we use "hcp".
 */
export function normalizeProductSlugForDevDot(
	productSlug: string
): ProductSlug {
	if (productSlug == 'cloud') {
		return 'hcp'
	} else if (isProductSlug(productSlug)) {
		return productSlug
	} else {
		throw new Error(
			`Error: unrecognized product or section slug "${productSlug}" in normalizeProductSlugForDevDot.`
		)
	}
}

/**
 * Given a "product" slug from a Dev Dot context,
 * such as in part of a URL,
 * Return a "product" slug compatible with the Learn API.
 *
 * This is very specifically targeted at normalizing "hcp" to "cloud".
 * In Tutorials contexts, we use "cloud"; in Dev Dot we use "hcp".
 */
export function normalizeProductSlugForTutorials(
	productSlug: string
): ProductSlug {
	if (productSlug == 'cloud') {
		return 'hcp'
	} else if (isProductSlug(productSlug)) {
		return productSlug
	} else {
		throw new Error(
			`Error: unrecognized product or section slug "${productSlug}" in normalizeProductSlugForTutorials.`
		)
	}
}
