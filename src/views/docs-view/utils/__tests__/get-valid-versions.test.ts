/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect } from 'vitest'
import { getValidVersions } from '../get-valid-versions'
import type { VersionSelectItem } from '../../loaders/remote-content'


describe('getValidVersions', () => {
	const versions: VersionSelectItem[] = [
		{
			version: '1.16.x',
			label: 'v1.16.x',
			name: 'v1.16.x',
			isLatest: true,
			releaseStage: 'stable',
			found: true,
		},
		{
			version: '1.15.x',
			label: 'v1.15.x',
			name: 'v1.15.x',
			isLatest: false,
			releaseStage: 'stable',
			found: false,
		},
	]
	const fullPath = 'doc#/path/to/document'
	const productSlugForLoader = 'vault'

	it('should return an empty array if versions are falsy or empty', async () => {
		expect(await getValidVersions([], fullPath, productSlugForLoader)).toEqual(
			[]
		)
		expect(
			await getValidVersions(
				undefined,
				fullPath,
				productSlugForLoader
			)
		).toEqual([])
	})

	it('should indicate found versions based on hard coded minimums', async () => {
		const [knownVersion, unknownVersion] = await getValidVersions(
			versions,
			fullPath,
			productSlugForLoader
		)
		expect(knownVersion.found).toBe(true)
		expect(unknownVersion.found).toBe(false)
	})
})
