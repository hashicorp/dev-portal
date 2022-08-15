import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { destroy } from 'lib/learn-client'
import { deleteBookmark } from '../delete-bookmark'
import { BOOKMARK_API_ROUTE } from '..'

const mockBookmark: ApiBookmark = {
	tutorial_id: 'test-tutorial-1',
	tutorial: {} as $TSFixMe,
	user_id: 'test-user',
}

jest.mock('lib/learn-client', () => {
	const originalModule = jest.requireActual('lib/learn-client')
	return {
		__esModule: true,
		...originalModule,
		destroy: jest.fn(),
	}
})

describe('deleteBookmark', () => {
	const mockedDestroy = destroy as jest.Mock
	const testAccessToken = 'test-token'
	const testTutorialId = mockBookmark.tutorial_id

	afterAll(() => {
		jest.mock('lib/learn-client', () => {
			const originalModule = jest.requireActual('lib/learn-client')
			return originalModule
		})
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
