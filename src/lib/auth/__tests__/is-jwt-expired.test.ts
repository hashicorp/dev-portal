import isJwtExpired from '../is-jwt-expired'

describe('is-jwt-expired', () => {
	let mockJwt: string
	let dateNowSpy: jest.SpyInstance
	beforeAll(() => {
		// Payload: {"exp": 1663855783, "iat": 1663855735 }
		mockJwt =
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjM4NTU3ODMsImlhdCI6MTY2Mzg1NTczNX0.Vs2duHe3NH4FKXwpEHFy2ZLsHu2pBtOO4OTUjlSIoUY'
		// Fix time to "2022-09-22T14:08:33.000Z"
		dateNowSpy = jest
			.spyOn(Date, 'now')
			.mockImplementation(() => Date.parse('2022-09-22T14:08:33.000Z'))
	})

	afterAll(() => {
		// Restore time
		dateNowSpy.mockRestore()
	})

	it('should return tuple of expiration status and seconds until expiry', () => {
		expect(isJwtExpired(mockJwt)).toMatchInlineSnapshot(`
		Array [
		  false,
		  70,
		]
	`)
	})

	it('should throw an error for an invalid jwt', () => {
		expect(() => isJwtExpired('foobar')).toThrowError(
			'isJwtExpired failed to parse jwt'
		)
	})
})
