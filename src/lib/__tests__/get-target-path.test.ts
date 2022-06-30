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
})
