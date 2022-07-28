import { RootDocsPath } from 'types/products'
import {
	prefixAllDocsSubpaths,
	removeCustomLandingPaths,
	parseRootDocsPath,
} from '../all-docs-server'

describe('prefixAllDocsSubpaths', () => {
	it('prefixes params with a provided basePath, and renames param to allDocs', () => {
		// Input
		const paths = [
			{
				params: {
					page: ['foo', 'bar'],
				},
			},
		]
		const basePath = 'some-base-path'
		// Expected output
		const expected = [
			{
				params: {
					allDocs: ['some-base-path', 'foo', 'bar'],
				},
			},
		]
		expect(prefixAllDocsSubpaths(paths, basePath)).toEqual(expected)
	})
})

describe('removeCustomLandingPaths', () => {
	it('removes custom landing paths', () => {
		// Input
		const paths = [
			['some-base-path'],
			['some-base-path', 'foo'],
			['some-base-path', 'foo', 'bar'],
			['another-base-path'],
			['another-base-path', 'fizz'],
		].map((params) => {
			return { params: { allDocs: params } }
		})
		const customLandingPaths = ['some-base-path']
		// Expected output
		const expected = [
			['some-base-path', 'foo'],
			['some-base-path', 'foo', 'bar'],
			['another-base-path'],
			['another-base-path', 'fizz'],
		].map((params) => {
			return { params: { allDocs: params } }
		})
		expect(removeCustomLandingPaths(paths, customLandingPaths)).toEqual(
			expected
		)
	})
})

describe('parseRootDocsPath', () => {
	it('parses the correct rootDocsPath config and pageParams from allDocs params', () => {
		// Input
		const params = {
			allDocs: ['cdktf', 'fizz', 'buzz'],
		}
		const rootDocsPaths: RootDocsPath[] = [
			{
				iconName: 'docs',
				name: 'CDKTF',
				path: 'cdktf',
				productSlugForLoader: 'terraform-cdk',
			},
			{
				iconName: 'docs',
				name: 'CLI',
				path: 'cli',
			},
			{
				iconName: 'docs',
				name: 'Cloud Docs',
				path: 'cloud-docs',
				productSlugForLoader: 'terraform-docs-common',
			},
		]
		// Expected output
		const expected = {
			rootDocsPath: {
				iconName: 'docs',
				name: 'CDKTF',
				path: 'cdktf',
				productSlugForLoader: 'terraform-cdk',
			},
			pageParams: ['fizz', 'buzz'],
		}
		expect(parseRootDocsPath(params, rootDocsPaths)).toEqual(expected)
	})
})
