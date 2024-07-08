/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { getAllBookmarks } from '../get-all-bookmarks'
import { BOOKMARK_API_ROUTE } from '..'
import type { Mock } from 'vitest'

vi.mock('lib/learn-client', () => ({
	get: vi.fn(),
}))

const mockBookmarks: ApiBookmark[] = [
	{
		created_at: null,
		id: 'test-bookmark-1',
		tutorial_id: 'test-tutorial-1',
		tutorial: {} as $TSFixMe,
		updated_at: null,
		user_id: 'test-user',
	},
	{
		created_at: null,
		id: 'test-bookmark-2',
		tutorial_id: 'test-tutorial-2',
		tutorial: {} as $TSFixMe,
		updated_at: null,
		user_id: 'test-user',
	},
]

describe('getAllBookmarks', () => {
	vi.spyOn(learnApi, 'get')

	const mockedGet = learnApi.get as Mock
	const testAccessToken = 'test-token'

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

		const result = await getAllBookmarks({
			accessToken: testAccessToken,
		})

		expect(mockedGet).lastCalledWith(BOOKMARK_API_ROUTE, testAccessToken)
		expect(result).toBe(mockBookmarks)
	})

	test('throws error if not `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: false,
		})

		expect(mockedGet).lastCalledWith(BOOKMARK_API_ROUTE, testAccessToken)
		expect(async () =>
			getAllBookmarks({
				accessToken: testAccessToken,
			})
		).rejects.toThrowError()
	})
})
