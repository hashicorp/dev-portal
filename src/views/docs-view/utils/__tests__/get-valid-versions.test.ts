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
				version: 'v1.2.x',
				label: 'v1.2.x (latest)',
				name: 'v1.2.x',
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.1.x',
				label: 'v1.1.x',
				name: 'v1.1.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.0.x',
				label: 'v1.0.x',
				name: 'v1.0.x',
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
	it('normalizes terraform/language path for version lookups', async () => {
		const versions: VersionSelectItem[] = [
			{
				version: 'v1.2.x',
				label: 'v1.2.x (latest)',
				name: 'v1.2.x',
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.1.x',
				label: 'v1.1.x',
				name: 'v1.1.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.0.x',
				label: 'v1.0.x',
				name: 'v1.0.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const [latest, found, notFound] = await getValidVersions(versions, 'doc#language', 'terraform')

		expect(latest.found).toBe(true)
		expect(found.found).toBe(true)
		expect(notFound.found).toBe(false)
	})
	it('normalizes terraform/intro path for version lookups', async () => {
		const versions: VersionSelectItem[] = [
			{
				version: 'v1.2.x',
				label: 'v1.2.x (latest)',
				name: 'v1.2.x',
				isLatest: true,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.1.x',
				label: 'v1.1.x',
				name: 'v1.1.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
			{
				version: 'v1.0.x',
				label: 'v1.0.x',
				name: 'v1.0.x',
				isLatest: false,
				releaseStage: 'stable',
				found: null,
			},
		]
		const [latest, found, notFound] = await getValidVersions(versions, 'doc#intro', 'terraform')

		expect(latest.found).toBe(true)
		expect(found.found).toBe(true)
		expect(notFound.found).toBe(false)
	})
})
