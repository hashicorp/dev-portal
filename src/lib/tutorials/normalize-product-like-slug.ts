import { LearnProductSlug, ProductSlug } from 'types/products'
import { isProductSlug } from 'lib/products'
import {
	isProductOption,
	isSectionOption,
	SectionOption,
	ThemeOption,
} from 'lib/learn-client/types'

/**
 * Given a "product" slug from a Tutorials context,
 * such as in part of a collection or tutorial slug,
 * Return a "product" slug compatible with Dev Dot's ProductSlug type.
 *
 * This is very specifically targeted at normalizing "cloud" to "hcp".
 * In Tutorials contexts, we use "cloud"; in Dev Dot we use "hcp".
 */
export function normalizeSlugForDevDot(
	productSlug: string
): ProductSlug | SectionOption {
	if (productSlug == 'cloud') {
		return 'hcp'
	} else if (isProductSlug(productSlug)) {
		return productSlug
	} else if (isSectionOption(productSlug)) {
		return productSlug
	} else {
		console.warn(
			`Error: unrecognized incoming Tutorials slug "${productSlug}" in normalizeSlugForDevDot.`
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
export function normalizeSlugForTutorials(
	slug: string
): LearnProductSlug | ThemeOption.cloud | SectionOption {
	if (slug == 'hcp' || slug == 'cloud') {
		return ThemeOption.cloud
	} else if (isProductOption(slug)) {
		return slug
	} else if (isSectionOption(slug)) {
		return slug
	} else {
		console.warn(
			`Error: unrecognized incoming productSlug "${slug}" in normalizeSlugForTutorials.`
		)
	}
}
