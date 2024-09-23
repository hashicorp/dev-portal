/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi } from 'vitest'
import { fetchValidVersions } from '../set-document-path'
import { isReleaseNotesPage } from 'lib/docs/is-release-notes-page'
import { getValidVersions } from '../get-valid-versions'
import { VersionSelectItem } from '../../loaders/remote-content'

vi.mock('lib/docs/is-release-notes-page')
vi.mock('../get-valid-versions')

describe('fetchValidVersions', () => {
	const versions: VersionSelectItem[] = [
		{
			version: 'v1.0.0',
			name: 'v1.0.0',
			label: 'v1.0.0',
			isLatest: false,
			releaseStage: 'stable',
		},
		{
			version: 'v2.0.0',
			name: '',
			label: '',
			isLatest: false,
			releaseStage: 'stable',
		},
	]

	const mockIsReleaseNotesPage = (returnValue: boolean) => {
		vi.mocked(isReleaseNotesPage).mockReturnValue(returnValue)
	}

	const mockGetValidVersions = (returnValue: VersionSelectItem[]) => {
		vi.mocked(getValidVersions).mockResolvedValue(returnValue)
	}

	const runTest = async (
		pathParts: string[],
		versionPathPart: string,
		basePathForLoader: string,
		productSlugForLoader: string,
		expectedPath: string,
		expectedVersions: VersionSelectItem[]
	) => {
		const result = await fetchValidVersions(
			pathParts,
			versionPathPart,
			basePathForLoader,
			versions,
			productSlugForLoader
		)

		expect(isReleaseNotesPage).toHaveBeenCalledWith(pathParts.join('/'))
		expect(getValidVersions).toHaveBeenCalledWith(
			versions,
			expectedPath,
			productSlugForLoader
		)
		expect(result).toEqual(expectedVersions)
	}

	it('should filter versions correctly for non-release notes pages', async () => {
		const pathParts = ['docs', 'v1.0.0', 'guide']
		const versionPathPart = 'v1.0.0'
		const basePathForLoader = '/base/path'
		const productSlugForLoader = 'product-slug'

		mockIsReleaseNotesPage(false)
		mockGetValidVersions([
			{
				version: 'v1.0.0',
				name: 'v1.0.0',
				label: 'v1.0.0',
				isLatest: false,
				releaseStage: 'stable',
			},
		])

		await runTest(
			pathParts,
			versionPathPart,
			basePathForLoader,
			productSlugForLoader,
			'doc#/base/path/docs/guide',
			[
				{
					version: 'v1.0.0',
					name: 'v1.0.0',
					label: 'v1.0.0',
					isLatest: false,
					releaseStage: 'stable',
				},
			]
		)
	})

	it('should filter versions correctly for release notes pages', async () => {
		const pathParts = ['v202409-2', 'releases', '2024', 'v202409-1']
		const versionPathPart = 'v202409-2'
		const basePathForLoader = 'enterprise'
		const productSlugForLoader = 'ptfe-releases'
		const releaseNotesVersions: VersionSelectItem[] = [
			{
				name: 'latest',
				label: 'v202409-2 (latest)',
				isLatest: true,
				releaseStage: 'stable',
				version: 'v202409-2',
			},
			{
				name: 'v202409-1',
				label: 'v202409-1',
				isLatest: false,
				releaseStage: 'stable',
				version: 'v202409-1',
			},
		]

		mockIsReleaseNotesPage(true)
		mockGetValidVersions(releaseNotesVersions)

		await runTest(
			pathParts,
			versionPathPart,
			basePathForLoader,
			productSlugForLoader,
			'doc#enterprise/releases/2024/v202409-1',
			releaseNotesVersions
		)
	})

	it('should handle paths without versions correctly', async () => {
		const pathParts = ['docs', 'guide']
		const versionPathPart = 'v1.0.0'
		const basePathForLoader = '/base/path'
		const productSlugForLoader = 'product-slug'

		mockIsReleaseNotesPage(false)
		mockGetValidVersions([
			{
				version: 'v1.0.0',
				name: 'v1.0.0',
				label: 'v1.0.0',
				isLatest: false,
				releaseStage: 'stable',
			},
		])

		await runTest(
			pathParts,
			versionPathPart,
			basePathForLoader,
			productSlugForLoader,
			'doc#/base/path/docs/guide',
			[
				{
					version: 'v1.0.0',
					name: 'v1.0.0',
					label: 'v1.0.0',
					isLatest: false,
					releaseStage: 'stable',
				},
			]
		)
	})
})
