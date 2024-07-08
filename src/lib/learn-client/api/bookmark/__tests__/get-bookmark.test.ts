/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { getBookmark } from '../get-bookmark'
import { BOOKMARK_API_ROUTE } from '..'
import type { Mock } from 'vitest'

vi.mock('lib/learn-client', () => ({
	get: vi.fn(),
}))

const mockBookmark: ApiBookmark = {
	created_at: null,
	id: 'test-bookmark-1',
	tutorial_id: 'test-tutorial-1',
	tutorial: {} as $TSFixMe,
	updated_at: null,
	user_id: 'test-user',
}

describe('getBookmark', () => {
	vi.spyOn(learnApi, 'get')

	const mockedGet = learnApi.get as Mock
	const testAccessToken = 'test-token'
	const testTutorialId = mockBookmark.tutorial_id

	afterAll(async () => {
		vi.restoreAllMocks()
	})

	test('returns `null` on 404', async () => {
		mockedGet.mockResolvedValueOnce({
			status: 404,
		})

		const result = await getBookmark({
			accessToken: testAccessToken,
			tutorialId: testTutorialId,
		})

		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
		expect(result).toBeNull()
	})

	test('returns bookmark object if `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: true,
			json: () => ({
				result: mockBookmark,
			}),
		})

		const result = await getBookmark({
			accessToken: testAccessToken,
			tutorialId: testTutorialId,
		})

		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
		expect(result).toBe(mockBookmark)
	})

	test('throws error if not `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: false,
		})

		expect(
			async () =>
				await getBookmark({
					accessToken: testAccessToken,
					tutorialId: testTutorialId,
				})
		).rejects.toThrowError()
		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
	})
})
