/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { isObject, traverse } from 'lib/traverse'
import { ProductViewBlock } from '../../components/product-view-content'
import detectAndReformatLearnUrl from '../detect-and-reformat-learn-url'

/**
 * Fix URLs in BrandedCallout blocks,
 * which may point to collection or tutorial URLs using the
 * learn.hashicorp.com URL structure.
 */
export async function fixBrandedCalloutUrls(
	blocks: ProductViewBlock[]
): Promise<ProductViewBlock[]> {
	const result = await traverse<unknown, { blocks: ProductViewBlock[] }>(
		{ blocks },
		(_key: string | number | symbol, value: unknown) => {
			// We only want to deal with branded callouts, with a defined cta.url
			const isBrandedCallout =
				isObject(value) && value.type === 'BrandedCallout'
			if (!isBrandedCallout) {
				return value
			}
			const { cta } = value
			if (!isObject(cta) || typeof cta.url !== 'string') {
				return value
			}
			// Fix the url
			const correctedUrl = detectAndReformatLearnUrl(cta.url)
			return { ...value, cta: { ...cta, url: correctedUrl } }
		}
	)
	return result.blocks
}
