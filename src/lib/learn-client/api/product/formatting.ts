/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiProduct } from '../api-types'
import { ProductOption, Product } from '../../types'

export function formatProduct(product: ApiProduct): Product {
	const { id, slug, name, description, docs_url } = product
	return { id, slug: ProductOption[slug], name, description, docsUrl: docs_url }
}
