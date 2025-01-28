/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { getBookmarksByTutorialIds } from '../get-bookmarks-by-tutorial-ids'
import { BOOKMARK_API_ROUTE } from '..'
import type { Mock } from 'vitest'

vi.mock('lib/learn-client', () => ({
	get: vi.fn(),
}))

// This mock uses partial since we don't need all parts of the object for testing
const mockBookmarks: Partial<ApiBookmark>[] = [
	{
		created_at: null,
		id: 'test-bookmark-1',
		tutorial_id: 'test-tutorial-1',
		updated_at: null,
		user_id: 'test-user',
	},
	{
		created_at: null,
		id: 'test-bookmark-2',
		tutorial_id: 'test-tutorial-2',
		updated_at: null,
		user_id: 'test-user',
	},
]

describe('getBookmarksByTutorialIds', () => {
	vi.spyOn(learnApi, 'get')

	const mockedGet = learnApi.get as Mock
	const testAccessToken = 'test-token'
	const testTutorialIds = ['1', '2', '3']

	afterAll(() => {
		vi.restoreAllMocks()
	})

	test('returns array of all bookmark objects if `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: true,
			json: () => ({
				result: mockBookmarks,
			}),
		})

		const result = await getBookmarksByTutorialIds({
			accessToken: testAccessToken,
			tutorialIds: testTutorialIds,
		})

		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}?tutorialIds=${testTutorialIds.join(',')}`,
			testAccessToken
		)
		expect(result).toBe(mockBookmarks)
	})

	test('throws error if not `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: false,
		})

		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}?tutorialIds=${testTutorialIds.join(',')}`,
			testAccessToken
		)
		expect(async () =>
			getBookmarksByTutorialIds({
				accessToken: testAccessToken,
				tutorialIds: testTutorialIds,
			})
		).rejects.toThrowError()
	})
})
