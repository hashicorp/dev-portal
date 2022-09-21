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
})
