/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getTargetPath } from '../get-target-path'

describe('getTargetPath', () => {
	describe('with a nested path', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/secrets/kv',
				version: 'v1.9.x',
			}

			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.9.x/secrets/kv')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.9.x/secrets/kv',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x/secrets/kv')
		})
	})

	describe('with a non-nested path', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.8.x',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x')
		})
	})

	it.each([
		[
			{
				basePath: 'terraform/enterprise',
				asPath: '/terraform/enterprise/v202208-3/releases/2022/v202208-2',
				version: 'v202208-2',
			},
			'/terraform/enterprise/v202208-2/releases/2022/v202208-2',
		],
		[
			{
				basePath: 'terraform/enterprise',
				asPath: '/terraform/enterprise/releases/2022/v202208-2',
				version: 'v202208-2',
			},
			'/terraform/enterprise/v202208-2/releases/2022/v202208-2',
		],
	])(
		'should handle additional TFE versions in release notes URLs',
		(arg, expected) => {
			const target = getTargetPath(arg)
			expect(target).toEqual(expected)
		}
	)

	it('should handle versions without a "v" prefix', () => {
		const input = {
			basePath: 'consul/docs',
			asPath: '/consul/docs/k8s/connect',
			version: '1.15.x',
		}
		const target = getTargetPath(input)
		expect(target).toEqual('/consul/docs/1.15.x/k8s/connect')
	})

	it('should handle short versions', () => {
		const input = {
			basePath: 'vault/docs',
			asPath: '/vault/docs/secrets/kv',
			version: 'v2.x',
		}
		const target = getTargetPath(input)
		expect(target).toEqual('/vault/docs/v2.x/secrets/kv')
	})

	describe('with 3-segment basePath (terraform/plugin/framework)', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/resources',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x/resources')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/v1.15.x/resources',
				version: 'v1.16.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.16.x/resources')
		})

		it('should handle nested paths with version switching', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/v1.15.x/functions/returns/number',
				version: 'v1.16.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.16.x/functions/returns/number')
		})

		it('should handle root path version switching', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x')
		})

		it('should handle getting-started paths', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/getting-started/code-walkthrough',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x/getting-started/code-walkthrough')
		})
	})

	describe('edge cases with version patterns in content paths', () => {
		it('should not replace version patterns beyond VERSION_CUTOFF_INDEX', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.17.x/upgrading/upgrade-to-1.17.x',
				version: 'v1.18.x',
			}
			const target = getTargetPath(input)
			// Should only replace the version at index 2, not the one in "upgrade-to-1.17.x"
			expect(target).toEqual('/vault/docs/v1.18.x/upgrading/upgrade-to-1.17.x')
		})

		it('should handle paths with version-like patterns in middle segments', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.16.x/releases/1.17.x/changes',
				version: 'v1.18.x',
			}
			const target = getTargetPath(input)
			// Should replace first version but preserve version-like content in path
			expect(target).toEqual('/vault/docs/v1.18.x/releases/1.17.x/changes')
		})

		it('should handle deeply nested paths with version patterns', () => {
			const input = {
				basePath: 'terraform/enterprise',
				asPath: '/terraform/enterprise/v202301-1/releases/2023/v202301-1',
				version: 'v202302-1',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/enterprise/v202302-1/releases/2023/v202301-1')
		})

		it('should handle paths with version-like strings in content beyond the version', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.16.x/upgrading/upgrade-from-1.15.x-to-1.16.x',
				version: 'v1.17.x',
			}
			const target = getTargetPath(input)
			// Version at the cutoff index gets replaced, but version patterns in deep content are preserved
			expect(target).toEqual('/vault/docs/v1.17.x/upgrading/upgrade-from-1.15.x-to-1.16.x')
		})

		it('should handle version pattern in first segment after basePath when no version exists', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.15.x-specific-feature',
				version: 'v1.16.x',
			}
			const target = getTargetPath(input)
			// The version pattern is in the content, not a version segment
			expect(target).toEqual('/vault/docs/v1.16.x/v1.15.x-specific-feature')
		})

		it('should handle 3-segment basePath with version-like content far from version', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/v1.10.x/migrating/from-v1.9.x',
				version: 'v1.11.x',
			}
			const target = getTargetPath(input)
			// Should only replace the actual version segment, not content
			expect(target).toEqual('/terraform/plugin/framework/v1.11.x/migrating/from-v1.9.x')
		})
	})
})
