/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getResponseData } from '../get-response-data'
import petstore3 from '../__fixtures__/petstore3.openapi'

describe('getResponseData', () => {
	it('parses multiple response definitions for single response code', async () => {
		const request = petstore3.paths['/pet/{petId}'].get
		const groups = await getResponseData(request.responses, 'test-prefix')
		expect(groups).toMatchSnapshot()
	})
})
