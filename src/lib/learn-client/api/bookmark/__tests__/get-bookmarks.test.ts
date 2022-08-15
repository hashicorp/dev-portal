import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { get } from 'lib/learn-client'
import { getBookmarks } from '../get-bookmarks'
import { BOOKMARK_API_ROUTE } from '..'

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

jest.mock('lib/learn-client', () => {
	const originalModule = jest.requireActual('lib/learn-client')
	return {
		__esModule: true,
		...originalModule,
		get: jest.fn(),
	}
})

describe('getBookmarks', () => {
	const mockedGet = get as jest.Mock
	const testAccessToken = 'test-token'

	afterAll(() => {
		jest.mock('lib/learn-client', () => {
			const originalModule = jest.requireActual('lib/learn-client')
			return originalModule
		})
	})

	test('returns array of all bookmark objects if `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: true,
			json: () => ({
				result: mockBookmarks,
			}),
		})

		const result = await getBookmarks({
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
			getBookmarks({
				accessToken: testAccessToken,
			})
		).rejects.toThrowError()
	})

	test('appends `tutorialIds` query parameter when given `tutorialIds`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: true,
			json: () => ({ result: [] }),
		})

		const testIds = ['1', '2', '3']
		await getBookmarks({
			accessToken: testAccessToken,
			tutorialIds: testIds,
		})

		expect(mockedGet).lastCalledWith(
			`${BOOKMARK_API_ROUTE}?tutorialIds=${testIds.join(',')}`,
			testAccessToken
		)
	})
})
