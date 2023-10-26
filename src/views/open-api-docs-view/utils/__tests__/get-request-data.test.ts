import { getRequestData } from '../get-request-data'
import petstore3 from '../__fixtures__/petstore3.openapi'

describe('getRequestData', () => {
	it('parses non-json request bodies', async () => {
		const request = petstore3.paths['/pet/{petId}/uploadImage'].post
		const groups = await getRequestData(
			request.parameters,
			request.requestBody,
			'test-prefix'
		)
		expect(groups).toMatchSnapshot()
	})
})
