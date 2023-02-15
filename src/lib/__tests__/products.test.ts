/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { productSlugsToNames } from 'lib/products'

describe('lib/products.ts', () => {
	test('productSlugsToNames is in the correct order', () => {
		expect(Object.keys(productSlugsToNames)).toEqual([
			'sentinel',
			'hcp',
			'terraform',
			'packer',
			'consul',
			'vault',
			'boundary',
			'nomad',
			'waypoint',
			'vagrant',
		])
	})
})
