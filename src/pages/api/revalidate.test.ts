/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { resolveProduct } from './revalidate'

describe('resolveProduct', () => {
	it('should return "terraform" for product names starting with "terraform-"', () => {
		const productRepoName = 'terraform-cdk'
		const result = resolveProduct(productRepoName)
		expect(result).toBe('terraform')
	})

	it('should return "terraform" for "ptfe-releases"', () => {
		const productRepoName = 'ptfe-releases'
		const result = resolveProduct(productRepoName)
		expect(result).toBe('terraform')
	})

	it('should return "hcp" for "hcp-docs"', () => {
		const productRepoName = 'hcp-docs'
		const result = resolveProduct(productRepoName)
		expect(result).toBe('hcp')
	})

	it('should return the same product slug for other product names', () => {
		const productRepoName = 'vault'
		const result = resolveProduct(productRepoName)
		expect(result).toBe(productRepoName)
	})
})
