/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect } from 'vitest'
import { getValidVersions, minimumVersions } from '../get-valid-versions'
import type { VersionSelectItem } from '../../loaders/remote-content'


describe('getValidVersions', () => {
	it.each(Object.entries(minimumVersions).filter(([slug]) => !slug.startsWith('terraform-')))('indicates found versions for %s above %s', async (slug, minVersion) => {
		const versions: VersionSelectItem[] = [
			{
				version: minVersion,
				label: `${minVersion} (latest)`,
				name: minVersion,
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v0.0.x',
				label: 'v0.0.x',
				name: 'v0.0.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const [latest, notFound] = await getValidVersions(versions, '', slug)
		expect(latest.found).toBe(true)
		expect(notFound.found).toBe(false)
	})

	it.each(Object.entries(minimumVersions).filter(([slug]) => slug.startsWith('terraform-')))('is able to detect %s with additional path segments', async (slug, minVersion) => {
		const versions: VersionSelectItem[] = [
			{
				version: minVersion,
				label: `${minVersion} (latest)`,
				name: minVersion,
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v0.0.x',
				label: 'v0.0.x',
				name: 'v0.0.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const [latest, found] = await getValidVersions(versions, 'doc#language/long/path/to/url', slug)

		expect(latest.found).toBe(true)
		expect(found.found).toBe(false)
	})
})
