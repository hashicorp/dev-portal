import {
	prefixAllDocsSubpaths,
	removeCustomLandingPaths,
	parseRootDocsPath,
} from '../all-docs-server'

describe('prefixAllDocsSubpaths', () => {
	it('prefixes paths in a basic example', () => {
		// Input
		const paths = [
			{
				params: {
					page: ['foo', 'bar'],
				},
			},
		]
		const basePath = 'my-basepath'
		// Output
		const expected = [
			{
				params: {
					allDocs: ['my-basepath', 'foo', 'bar'],
				},
			},
		]
		// Expect
		expect(prefixAllDocsSubpaths(paths, basePath)).toEqual(expected)
	})

	it.todo('has more tests')
})

describe('removeCustomLandingPaths', () => {
	it.todo('has more tests')
})

describe('parseRootDocsPath', () => {
	it.todo('has more tests')
})
