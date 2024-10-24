/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { groupItemsByKey } from './group-items-by-key'

describe('groupItemsByKey', () => {
	it('groups items by a specified property', async () => {
		// Define an array of items to test
		const items = [
			{
				path: '/resource-manager/organizations',
			},
			{
				path: '/resource-manager/organizations/{id}',
			},
		]
		// Define a function to get a group key from each item
		function getGroupKeyFromPath(item): string {
			return item.path.split('/').slice(0, 3).join('/')
		}
		// Get the result of grouping the items, it should match what we expect
		const result = groupItemsByKey(items, getGroupKeyFromPath)
		const expected = [
			{
				key: '/resource-manager/organizations',
				items: [
					{
						path: '/resource-manager/organizations',
					},
					{
						path: '/resource-manager/organizations/{id}',
					},
				],
			},
		]
		expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
	})
})
