import { getSlugsForRemoteLoader } from './get-slugs-for-remote-loader'

const testCases = [
	{
		description: 'returns a typical productSlug and basePath',
		input: ['waypoint', 'docs'],
		expected: ['waypoint', 'docs'],
	},
	{
		description: 'returns a non-standard productSlugForLoader',
		input: ['hcp', 'docs'],
		expected: ['hcp-docs', 'docs'],
	},
	{
		description: 'returns a non-standard basePathForLoader',
		input: ['sentinel', 'docs'],
		expected: ['sentinel', 'sentinel'],
	},
]
describe('getSlugsForRemoteLoader', () => {
	for (const testCase of testCases) {
		const { description, input, expected } = testCase
		it(description, () => {
			const { productSlug, basePath } = getSlugsForRemoteLoader(
				input[0],
				input[1]
			)
			expect(productSlug).toBe(expected[0])
			expect(basePath).toBe(expected[1])
		})
	}
})
