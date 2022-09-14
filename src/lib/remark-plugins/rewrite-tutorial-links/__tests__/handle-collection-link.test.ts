import { handleCollectionLink } from '../utils'

describe('handleCollectionLink', () => {
	const testCases = [
		[
			'/collections/consul/cloud-get-started',
			'/consul/tutorials/cloud-get-started',
		],
		['/collections/vault/getting-started', '/vault/tutorials/getting-started'],
		['/collections/waypoint/deploy-aws', '/waypoint/tutorials/deploy-aws'],
		[
			'/collections/onboarding/hcp-vault-week-1',
			'/onboarding/hcp-vault-week-1',
		],
		[
			'/collections/well-architected-framework/com',
			'/well-architected-framework/com',
		],
		[
			'/collections/well-architected-framework/com?paramA=valueA&paramB=valueB',
			'/well-architected-framework/com?paramA=valueA&paramB=valueB',
		],
		[
			'/collections/well-architected-framework/com#an-anchor',
			'/well-architected-framework/com#an-anchor',
		],
		[
			'/collections/well-architected-framework/com?paramA=valueA&paramB=valueB#an-anchor',
			'/well-architected-framework/com?paramA=valueA&paramB=valueB#an-anchor',
		],
	]

	test.each(testCases)(
		'%p is rewritten to %p',
		(testInput: string, expectedOutput: string) => {
			expect(handleCollectionLink(testInput)).toEqual(expectedOutput)
		}
	)
})
