/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { createBookmark } from '../create-bookmark'
import { BOOKMARK_API_ROUTE } from '..'
import type { Mock } from 'vitest'

vi.mock('lib/learn-client', () => ({
	post: vi.fn(),
}))

// This mock uses partial since we don't need all parts of the object for testing
const mockBookmark: Partial<ApiBookmark> = {
	created_at: null,
	id: 'test-bookmark-1',
	tutorial_id: 'test-tutorial-1',
	updated_at: null,
	user_id: 'test-user',
}

describe('createBookmark', () => {
	const mockedPost = learnApi.post as Mock
	const testAccessToken = 'test-token'
	const testTutorialId = mockBookmark.tutorial_id

	afterAll(async () => {
		vi.restoreAllMocks()
	})

	test('returns new bookmark object if `ok`', async () => {
		mockedPost.mockResolvedValueOnce({
			ok: true,
			json: () => ({ result: mockBookmark }),
		})

		const result = await createBookmark({
			accessToken: testAccessToken,
			tutorialId: testTutorialId,
		})

		expect(mockedPost).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
		expect(result).toBe(mockBookmark)
	})

	test('throws error if not `ok`', async () => {
		mockedPost.mockResolvedValueOnce({
			ok: false,
		})

		expect(
			async () =>
				await createBookmark({
					accessToken: testAccessToken,
					tutorialId: testTutorialId,
				})
		).rejects.toThrowError()
		expect(mockedPost).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
	})
})
