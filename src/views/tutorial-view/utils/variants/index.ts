import { TutorialVariant, TutorialVariantOption } from './types'

export function getVariantPath(path: string, variantType: string) {
	const url = new URL(path, 'https://developer.hashicorp.com')

	// if the variant is not defined, or if it is defined in the path already, use that
	if (!variantType || url.searchParams.get('variants') === variantType) {
		return path
	}

	// otherwise just add the variant to the path
	url.searchParams.set('variants', variantType)

	return url.pathname.toString() + url.search.toString()
}

export function getVariantParam(
	slug: TutorialVariant['slug'],
	optionSlug: TutorialVariantOption['slug']
) {
	return `${slug}:${optionSlug}`
}
