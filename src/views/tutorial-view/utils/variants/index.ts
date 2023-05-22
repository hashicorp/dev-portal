import Cookies from 'js-cookie'
import {
	TutorialVariant as ClientTutorialVariant,
	TutorialVariantOption as ClientTutorialVariantOption,
} from 'lib/learn-client/types'
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

export function handleVariantCookie(slug: string, optionSlug: string) {
	const key = `variant-${slug}`
	const value = Cookies.get(key)

	// if it exists and its not already set with the same value
	if (!value || value !== optionSlug) {
		Cookies.set(`variant-${slug}`, optionSlug)
	}
}

export function getTutorialViewVariantData(
	variantSlug: string,
	tutorialVariant?: ClientTutorialVariant
): TutorialVariant | undefined {
	let variant = undefined

	if (tutorialVariant) {
		// find the default variant base on the order number
		const defaultVariantOption = tutorialVariant.options.find(
			(option: ClientTutorialVariantOption) => option.displayOrder === 1
		)
		let activeOption = defaultVariantOption

		// if the variant slug is passed via query param, use that, otherwise pass the default
		if (variantSlug) {
			// slugs in the query params are formatted like ?variants=slug:optionSlug
			const [paramVariantSlug, paramOptionSlug] = variantSlug.split(':')
			const isValidVariantOption = tutorialVariant.options.find(
				(el: ClientTutorialVariantOption) => el.slug === paramOptionSlug
			)
			// check that the variant slug pass is valid, isn't the default
			// and matches an available option in the tutorial variant data
			const isValidVariantParam =
				paramVariantSlug &&
				paramOptionSlug &&
				paramVariantSlug === tutorialVariant.slug &&
				paramOptionSlug !== defaultVariantOption.slug &&
				isValidVariantOption

			if (isValidVariantParam) {
				// if its not the default, set a different active option
				activeOption = tutorialVariant.options.find(
					(option: ClientTutorialVariantOption) =>
						option.slug === paramOptionSlug
				)
			}
		}

		variant = {
			...tutorialVariant,
			activeOption,
		}
	}

	return variant
}

export type { TutorialVariant, TutorialVariantOption }
