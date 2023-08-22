/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Cookies from 'js-cookie'
import {
	TutorialVariant as ClientTutorialVariant,
	TutorialVariantOption as ClientTutorialVariantOption,
} from 'lib/learn-client/types'
import { TutorialVariant, TutorialVariantOption } from './types'

/**
 * Get the variant href for a given tutorial path and variant type.
 *
 * This is the URL with a path format, like `/variant:option`, that we need for
 * `getStaticProps` to return the correct variant data.
 */
export function getVariantHref(path: string, variantType: string) {
	return `${path}/${variantType}`.replace(':', '%3A')
}

/**
 * Get the variant path for a given current path and variant type.
 *
 * This is the URL with a search param format, like `?varaints=variant:option`.
 * This is the URL that we want users to see.
 */
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

export function sortVariantOptions(
	a: TutorialVariantOption,
	b: TutorialVariantOption
) {
	return a.displayOrder - b.displayOrder
}

/**
 * All variant cookie data is stored as a stringified object
 * with the shape { slug : optionSlug }, real world usecase:
 * {"operating-system":"macos","deploy":"hcp"}
 *
 * This function checks for the `variants` cookie, parses the
 * object and looks for the variant slug as a property on that object
 * If its not set, the property / value is added, otherwise its overwritten
 *
 */

export function handleVariantCookie(slug: string, optionSlug: string) {
	const key = 'variants'
	let variantsObj = {}

	try {
		const variantsCookie = Cookies.get(key)

		if (variantsCookie) {
			variantsObj = JSON.parse(variantsCookie)
		}
	} catch (e) {
		console.error('[handleVariantCookie]: Error parsing variants cookie ', e)
	}

	if (!variantsObj[slug] || variantsObj[slug] !== optionSlug) {
		variantsObj[slug] = optionSlug
		Cookies.set(key, JSON.stringify(variantsObj))
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
			// slugs in the query params are formatted like `slug:optionSlug`
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
