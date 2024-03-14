/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { isReleaseNotesPage } from 'lib/docs/is-release-notes-page'

describe('isReleaseNotesPage', () => {
	it('returns true for valid release notes page paths', () => {
		const validPaths = [
			'/releases/2022/v220601-1',
			'/releases/2021/v210601-2',
			'/release-notes/1.2.3',
			'/release-notes/2.0.x',
			'/release-notes/v2.0.x',
			'/boundary/docs/release-notes/v0_15_0',
			'/vault/docs/release-notes/1.13.0',
		]

		validPaths.forEach((path) => {
			expect(isReleaseNotesPage(path)).toBe(true)
		})
	})

	it('returns false for invalid release notes page paths', () => {
		const invalidPaths = [
			'/releases/2022/v220601',
			'/releases/2021/v210601',
			'/release-notes/1.2',
			'/release-notes/2.0',
			'/release-notes/2.x',
			'/releases/2022/v220601-',
			'/releases/2021/v210601-',
			'/release-notes/1.2.',
			'/release-notes/2.0.',
			'/release-notes/2.x.',
			'/releases/2022/v220601-1234-5678',
			'/releases/2021/v210601-5678-1234',
			'/release-notes/1.2.3.4',
			'/release-notes/2.0.x.y',
		]
		invalidPaths.forEach((path) => {
			expect(isReleaseNotesPage(path)).toBe(false)
		})
	})

	it('returns false for non-release notes page paths', () => {
		const nonReleaseNotesPaths = [
			'/releases',
			'/getting-started',
			'/enterprise/v202401-1/migrate',
			'/enterprise/v202401-1/releases',
			'/waypoint/reference/config',
			'/vault/install',
		]
		nonReleaseNotesPaths.forEach((path) => {
			expect(isReleaseNotesPage(path)).toBe(false)
		})
	})
})
