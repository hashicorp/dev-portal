/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { cachedGetProductData } from 'lib/get-product-data'
import { ProductSlug, RootDocsPath } from 'types/products'

function normalizerShim(productSlug, basePath) {
	const basicNormalizers = {
		'terraform-website__extend': {
			productSlug: 'terraform-website',
			basePath: 'plugin',
		},
		'terraform-docs-agents__cloud-docs-agents': {
			productSlug: 'terraform-docs-agents',
			basePath: 'cloud-docs/agents',
		},
		'terraform-plugin-framework__plugin-framework': {
			productSlug: 'terraform-plugin-framework',
			basePath: 'plugin/framework',
		},
		'terraform-plugin-log__plugin-log': {
			productSlug: 'terraform-plugin-log',
			basePath: 'plugin/log',
		},
		'terraform-plugin-mux__plugin-mux': {
			productSlug: 'terraform-plugin-mux',
			basePath: 'plugin/mux',
		},
		'terraform-plugin-sdk__plugin-sdkv2': {
			productSlug: 'terraform-plugin-sdk',
			basePath: 'plugin/sdkv2',
		},
		'terraform-plugin-testing__plugin-testing': {
			productSlug: 'terraform-plugin-testing',
			basePath: 'plugin/testing',
		},
	}
	return (
		basicNormalizers[`${productSlug}__${basePath}`] || {
			productSlug,
			basePath,
		}
	)
}
/**
 * Given the product slug and base path from a known docs URL,
 * Return the `productSlug` and `basePath` needed to fetch that
 * document from the docs content API.
 *
 * @TODO write a few test cases
 */
export function getSlugsForRemoteLoader(
	urlProductSlug: string,
	urlBasePath: string
): { productSlug; basePath } {
	const normalized = normalizerShim(urlProductSlug, urlBasePath)
	try {
		const productData = cachedGetProductData(
			normalized.productSlug as ProductSlug
		)
		const rootDocsPath = productData.rootDocsPaths.find(
			(rootDocsPath: RootDocsPath) => {
				return rootDocsPath.path === normalized.basePath
			}
		)
		return {
			productSlug: rootDocsPath?.productSlugForLoader || normalized.productSlug,
			basePath: rootDocsPath?.basePathForLoader || normalized.basePath,
		}
	} catch (e) {
		return normalized
	}
}
