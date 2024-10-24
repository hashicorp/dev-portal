/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { groupOperations } from '../group-operations'

describe('groupOperations', () => {
	it('groups operations by path, when specified', async () => {
		const operationObjects = [
			{
				path: {
					truncated: '/resource-manager/organizations',
				},
				tags: [],
			},
			{
				path: {
					truncated: '/resource-manager/organizations/{id}',
				},
				tags: [],
			},
		]
		const result = groupOperations(operationObjects, true)
		const expected = [
			{
				// NOTE: heading contains word break characters, this is intentional,
				// to prevent text overflow in constrained spaces, eg sidebar
				heading: '​/​resource-manager​/​organizations',
				items: [
					{
						path: {
							truncated: '/resource-manager/organizations',
						},
						tags: [],
					},
					{
						path: {
							truncated: '/resource-manager/organizations/{id}',
						},
						tags: [],
					},
				],
			},
		]
		expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
	})
})
