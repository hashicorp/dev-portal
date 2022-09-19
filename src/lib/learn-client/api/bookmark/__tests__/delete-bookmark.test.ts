import { ApiBookmark } from 'lib/learn-client/api/api-types'
import * as learnApi from 'lib/learn-client'
import { deleteBookmark } from '../delete-bookmark'
import { BOOKMARK_API_ROUTE } from '..'

const mockBookmark: ApiBookmark = {
	created_at: null,
	id: 'test-bookmark-1',
	tutorial_id: 'test-tutorial-1',
	tutorial: {} as $TSFixMe,
	updated_at: null,
	user_id: 'test-user',
}

describe('deleteBookmark', () => {
	jest.spyOn(learnApi, 'destroy')

	const mockedDestroy = learnApi.destroy as jest.Mock
	const testAccessToken = 'test-token'
	const testTutorialId = mockBookmark.tutorial_id

	afterAll(() => {
		jest.restoreAllMocks()
	})

	test('returns if `ok`', async () => {
		mockedDestroy.mockResolvedValueOnce({
			ok: true,
		})

		const result = await deleteBookmark({
			accessToken: testAccessToken,
			tutorialId: testTutorialId,
		})

		expect(mockedDestroy).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
		expect(result).toBeUndefined()
	})

	test('throws error if not `ok`', async () => {
		mockedDestroy.mockResolvedValueOnce({
			ok: false,
		})

		expect(
			async () =>
				await deleteBookmark({
					accessToken: testAccessToken,
					tutorialId: testTutorialId,
				})
		).rejects.toThrowError()
		expect(mockedDestroy).lastCalledWith(
			`${BOOKMARK_API_ROUTE}/${testTutorialId}`,
			testAccessToken
		)
	})
})
