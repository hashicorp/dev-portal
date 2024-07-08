/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import {
	ApiFeaturedCollection,
	ApiTutorialLite,
	ApiTutorialVariantOption,
} from 'lib/learn-client/api/api-types'

async function fetchTutorialsWithVariants() {
	const params = new URLSearchParams({ hasVariants: '1' })
	const queryStr = `?${params.toString()}`
	const route = '/tutorials' + queryStr
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}${route}`,
		{
			method: 'GET',
		}
	)

	if (response.ok) {
		const data = await response.json()
		return data.result
	} else {
		return new Error(`${response.status} ${response.statusText}`)
	}
}

/**
 * Fetch all the tutorials with variants defined and build up a map
 * of every possible collection tutorial path and the associated variant
 * slug and variant options. Example output:
 *
 * "/consul/tutorials/kubernetes/kubernetes-api-gateway": {
 *  "slug": "consul-deploy",
 *  "options": [
 *    "hcp",
 *    "self-managed"
 *  ],
 *  "defaultOption": "hcp",
 * },
 */
async function getVariantRewrites() {
	// get all tutorial paths with variants
	const tutorialsWithVariants = await fetchTutorialsWithVariants()
	const variantsObj = {}

	// return early if no tutorials have variants
	if (tutorialsWithVariants.length === 0) {
		return variantsObj
	}

	// for each tutorial that has variants defined
	tutorialsWithVariants.map((tutorial: ApiTutorialLite) => {
		const tutorialFilename = tutorial.slug.split('/')[1]
		const variant = tutorial.variants[0] // we only support 1 variant right now

		// map over the collection paths to build up each tutorial path with the variant options
		tutorial.featured_collections.map((collection: ApiFeaturedCollection) => {
			const [product, collectionFilename] = collection.slug.split('/')
			let path = `/${product}/tutorials/${collectionFilename}/${tutorialFilename}`

			if (
				product === 'onboarding' ||
				product === 'well-architected-framework'
			) {
				path = `/${product}/${collectionFilename}/${tutorialFilename}`
			}

			const defaultOption = variant.options.find(
				(option: ApiTutorialVariantOption) => option.display_order === 1
			)

			variantsObj[path] = {
				slug: variant.slug,
				options: variant.options.map(
					({ slug }: ApiTutorialVariantOption) => slug
				),
				defaultOption: defaultOption.slug,
			}
		})
	})

	return variantsObj
}

// @TODO if this file gets too large, consider storing it in vercel edge config
// https://vercel.com/docs/storage/edge-config
;(async function writeVariantRewriteMap() {
	const variantRewrites = await getVariantRewrites()

	await fs.promises.mkdir(path.join(process.cwd(), 'src', '.generated'), {
		recursive: true,
	})

	await fs.promises.writeFile(
		path.join('src', '.generated', 'tutorial-variant-map.json'),
		JSON.stringify(variantRewrites, null, 2),
		'utf-8'
	)
})()
