/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getVersionFromPath } from '../get-version-from-path'

describe('getVersionFromPath', () => {
	it('should return the version if it is present', () => {
		{
			const path = 'https://developer.hashicorp.com/vault/docs/v1.8.x/platform'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v1.8.x')
		}

		{
			/** future case w/ TFE */
			const path =
				'https://developer.hashicorp.com/terraform/enterprise/v202205-1/reference-architecture'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202205-1')
		}

		{
			const path = 'https://developer.hashicorp.com/waypoint/docs/0.7.x/getting-started'

			const version = getVersionFromPath(path)
			expect(version).toEqual('0.7.x')
		}
	})

	it('should return `undefined` if no version is present', () => {
		const path = 'https://developer.hashicorp.com/waypoint/docs/getting-started'
		const version = getVersionFromPath(path)
		expect(version).toBeUndefined()
	})

	it('should return `undefined` if version is not formatted properly', () => {
		const path =
			'https://developer.hashicorp.com/waypoint/docs/test/getting-started'
		const version = getVersionFromPath(path)
		expect(version).toBeUndefined()
	})
})
