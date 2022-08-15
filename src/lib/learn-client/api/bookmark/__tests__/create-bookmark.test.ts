import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { createBookmark } from '../create-bookmark'
import { BOOKMARK_API_ROUTE } from '..'

const mockBookmark: ApiBookmark = {
	created_at: null,
	id: 'test-bookmark-1',
	tutorial_id: 'test-tutorial-1',
	tutorial: {} as $TSFixMe,
	updated_at: null,
	user_id: 'test-user',
}

describe('createBookmark', () => {
	jest.spyOn(learnApi, 'post')

	const mockedPost = learnApi.post as jest.Mock
	const testAccessToken = 'test-token'
	const testTutorialId = mockBookmark.tutorial_id

	afterAll(async () => {
		jest.restoreAllMocks()
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
