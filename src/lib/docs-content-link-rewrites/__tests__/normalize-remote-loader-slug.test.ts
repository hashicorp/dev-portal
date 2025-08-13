/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { normalizeRemoteLoaderSlug } from '../normalize-remote-loader-slug'

const REMOTE_LOADER_SLUGS_TO_PRODUCT_SLUGS = {
	'hcp-docs': 'hcp',
	'terraform-enterprise': 'terraform',
	'terraform-cdk': 'terraform',
	'terraform-docs-agents': 'terraform',
	'terraform-docs-common': 'terraform',
	'terraform-plugin-framework': 'terraform',
	'terraform-plugin-log': 'terraform',
	'terraform-plugin-mux': 'terraform',
	'terraform-plugin-sdk': 'terraform',
	boundary: 'boundary',
	nomad: 'nomad',
	packer: 'packer',
	vagrant: 'vagrant',
	vault: 'vault',
	waypoint: 'waypoint',
}

describe('normalizeRemoteLoaderSlug', () => {
	describe('valid slugs', () => {
		const testCases: [input: string, expectedOutput: string][] = Object.keys(
			REMOTE_LOADER_SLUGS_TO_PRODUCT_SLUGS
		).map((remoteLoaderSlug: string) => {
			const productSlug = REMOTE_LOADER_SLUGS_TO_PRODUCT_SLUGS[remoteLoaderSlug]
			return [remoteLoaderSlug, productSlug]
		})
		test.each(testCases)(
			'%s => %s',
			(input: string, expectedOutput: string) => {
				expect(normalizeRemoteLoaderSlug(input)).toBe(expectedOutput)
			}
		)
	})

	describe('invalid slugs', () => {
		test.each([
			'invalid.loader.slug',
			'invalid-loader-slug',
			'invalid/loader/slug',
			'invalid loader slug',
		])('%s throws an error', (invalidSlug: string) => {
			expect(() => normalizeRemoteLoaderSlug(invalidSlug)).toThrowError()
		})
	})
})
