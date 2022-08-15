import { ApiBookmark } from 'lib/learn-client/api/api-types'
import { get } from 'lib/learn-client'
import { getBookmark } from '../get-bookmark'

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
		get: jest.fn(),
	}
})

describe('getBookmark', () => {
	const mockedGet = get as jest.Mock
	const wrappedGetBookmark = async () =>
		getBookmark({
			accessToken: 'test-token',
			tutorialId: '123',
		})

	afterAll(() => {
		jest.mock('lib/learn-client', () => {
			const originalModule = jest.requireActual('lib/learn-client')
			return originalModule
		})
	})

	test('returns `null` on 404', async () => {
		mockedGet.mockResolvedValueOnce({
			status: 404,
		})

		const result = await wrappedGetBookmark()

		expect(result).toBeNull()
	})

	test('returns bookmark object if `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: true,
			json: () => ({
				result: mockBookmark,
			}),
		})

		const result = await wrappedGetBookmark()

		expect(result).toBe(mockBookmark)
	})

	test('throws error if not `ok`', async () => {
		mockedGet.mockResolvedValueOnce({
			ok: false,
		})

		expect(wrappedGetBookmark()).rejects.toThrowError()
	})
})
