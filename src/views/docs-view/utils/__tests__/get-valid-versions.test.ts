/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect } from 'vitest'
import { getValidVersions } from '../get-valid-versions'
import type { VersionSelectItem } from '../../loaders/remote-content'


describe('getValidVersions', () => {

	it('indicates found versions based on hard coded minimums', async () => {
		const versions: VersionSelectItem[] = [
			{
				version: 'v1.16.x',
				label: 'v1.16.x (latest)',
				name: 'v1.16.x',
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.15.x',
				label: 'v1.15.x',
				name: 'v1.15.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const result = await getValidVersions(versions, '', 'vault')
		expect(result.map(({ found }) => found)).toEqual([true, false])

	})
	it('normalizes terraform-cli path for version lookups', async () => {
		const versions: VersionSelectItem[] = [
			{
				version: 'v1.12.x',
				label: 'v1.12.x (latest)',
				name: 'v1.12.x',
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.13.x',
				label: 'v1.13.x (rc)',
				name: 'v1.13.x',
				isLatest: false,
				releaseStage: 'rc',
				found: null,
			},
			{
				version: 'v1.11.x',
				label: 'v1.11.x',
				name: 'v1.11.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const [latest, found, notFound] = await getValidVersions(versions, 'doc#cli', 'terraform')

		expect(latest.found).toBe(true)
		expect(found.found).toBe(true)
		expect(notFound.found).toBe(false)
	})
})
