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
		// Expected output
		const expected = [
			{
				params: {
					allDocs: ['my-basepath', 'foo', 'bar'],
				},
			},
		]
		expect(prefixAllDocsSubpaths(paths, basePath)).toEqual(expected)
	})
})

describe('removeCustomLandingPaths', () => {
	it('removes custom landing paths in a basic example', () => {
		// Input
		const paths = [
			{
				params: {
					allDocs: ['my-basepath'],
				},
			},
			{
				params: {
					allDocs: ['my-basepath', 'foo'],
				},
			},
			{
				params: {
					allDocs: ['my-basepath', 'foo', 'bar'],
				},
			},
			{
				params: {
					allDocs: ['another-basepath'],
				},
			},
			{
				params: {
					allDocs: ['another-basepath', 'fizz'],
				},
			},
		]
		const customLandingPaths = ['my-basepath']
		// Expected output
		const expected = [
			{
				params: {
					allDocs: ['my-basepath', 'foo'],
				},
			},
			{
				params: {
					allDocs: ['my-basepath', 'foo', 'bar'],
				},
			},
			{
				params: {
					allDocs: ['another-basepath'],
				},
			},
			{
				params: {
					allDocs: ['another-basepath', 'fizz'],
				},
			},
		]
		expect(removeCustomLandingPaths(paths, customLandingPaths)).toEqual(
			expected
		)
	})
})

describe('parseRootDocsPath', () => {
	it.todo('has more tests')
})
