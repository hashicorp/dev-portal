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
			const path =
				'https://developer.hashicorp.com/terraform/enterprise/v202205-1/reference-architecture'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202205-1')
		}

		{
			const path =
				'https://developer.hashicorp.com/terraform/enterprise/reference-architecture/2022/v202205-1'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202205-1')
		}

		{
			const path =
				'https://developer.hashicorp.com/terraform/enterprise/v202205-1/reference-architecture'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202205-1')
		}

		{
			const path =
				'http://localhost:3000/terraform/enterprise/releases/2024/v202401-1'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202401-1')
		}

		{
			const path =
				'http://localhost:3000/terraform/enterprise/v202301-1/releases/2023/v202301-1'

			const version = getVersionFromPath(path)
			expect(version).toEqual('v202301-1')
		}
	})

	it('should return `undefined` if no version is present', () => {
		const path = 'https://developer.hashicorp.com/waypoint/docs/getting-started'
		const version = getVersionFromPath(path)
		expect(version).toBeUndefined()
	})

	it('should return `undefined` if version is not formatted properly', () => {
		const path =
			'https://developer.hashicorp.com/waypoint/docs/0.7.x/getting-started'
		const version = getVersionFromPath(path)
		expect(version).toBeUndefined()
	})
})
