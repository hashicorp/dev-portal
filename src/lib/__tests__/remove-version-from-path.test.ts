/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { removeVersionFromPath } from '../remove-version-from-path'

describe('removeVersionFromPath', () => {
	it('should return a cleaned path', () => {
		{
			const path = 'https://developer.hashicorp.com/vault/docs/v1.8.x/platform'

			const cleanedPath = removeVersionFromPath(path)
			expect(cleanedPath).toEqual(
				'https://developer.hashicorp.com/vault/docs/platform'
			)
		}

		{
			/** future case w/ TFE */
			const path =
				'https://developer.hashicorp.com/terraform/enterprise/v202205-1/reference-architecture'

			const cleanedPath = removeVersionFromPath(path)
			expect(cleanedPath).toEqual(
				'https://developer.hashicorp.com/terraform/enterprise/reference-architecture'
			)
		}

		{
			const path = 'https://developer.hashicorp.com/vault/docs/1.8.x/platform'

			const cleanedPath = removeVersionFromPath(path)
			expect(cleanedPath).toEqual(
				'https://developer.hashicorp.com/vault/docs/platform'
			)
		}
	})

	it('should return the original path if no version is present', () => {
		const path = 'https://developer.hashicorp.com/vault/docs/platform'

		const cleanedPath = removeVersionFromPath(path)
		expect(cleanedPath).toEqual(
			'https://developer.hashicorp.com/vault/docs/platform'
		)
	})
})
