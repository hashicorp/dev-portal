/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import FileSystemLoader from '../file-system'
import navData from '../__fixtures__/navData.json'

vi.mock('../utils/resolve-nav-data', () => {
	return {
		resolveNavData: async () => navData,
	}
})

const CONTENT_DIR = 'src/views/docs-view/loaders/__fixtures__'

let loader: FileSystemLoader

import * as nextMdxRemote from 'lib/next-mdx-remote/serialize'
vi.mock('lib/next-mdx-remote/serialize', async () => ({
	__esModule: true,
	...((await vi.importActual('lib/next-mdx-remote/serialize')) as $TSFixMe),
}))
const serializeSpy = vi.spyOn(nextMdxRemote, 'serialize').mockReturnValue(
	Promise.resolve({
		compiledSource: '',
		scope: {
			version: 'latest',
		},
	})
)
const mockMdxContentHook = vi.fn()

describe('FileSystemLoader', () => {
	beforeAll(() => {
		loader = new FileSystemLoader({
			navDataFile: 'test',
			localContentDir: CONTENT_DIR,
			product: 'waypoint',
		})
	})

	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('generates path from nav data', async () => {
		const paths = await loader.loadStaticPaths()

		expect(paths).toMatchSnapshot()
	})

	test('generates static props from mdx file', async () => {
		const props = await loader.loadStaticProps({ params: {} })

		expect(props).toMatchInlineSnapshot(
			{
				mdxSource: { compiledSource: expect.any(String) },
				navData: expect.any(Array),
			},
			`
		{
		  "currentPath": "",
		  "frontMatter": {
		    "description": "Welcome to the intro guide to Vault! This guide is the best place to start with Vault. We cover what Vault is, what problems it can solve, how it compares to existing software, and contains a quick start for using Vault.",
		    "page_title": "Introduction",
		  },
		  "githubFileUrl": "https://github.com/hashicorp/waypoint/blob/main/website/src/views/docs-view/loaders/__fixtures__/index.mdx",
		  "mdxSource": {
		    "compiledSource": Any<String>,
		    "scope": {
		      "version": "latest",
		    },
		  },
		  "navData": Any<Array>,
		  "versions": [],
		}
	`
		)
	})

	test('uses provided githubFileUrl if provided', async () => {
		const l = new FileSystemLoader({
			navDataFile: 'test',
			localContentDir: CONTENT_DIR,
			product: 'waypoint',
			githubFileUrl(p) {
				return `https://hashicorp.com/${p}`
			},
		})
		const props = await l.loadStaticProps({ params: {} })

		expect(props).toMatchInlineSnapshot(
			{
				mdxSource: { compiledSource: expect.any(String) },
				navData: expect.any(Array),
			},
			`
		{
		  "currentPath": "",
		  "frontMatter": {
		    "description": "Welcome to the intro guide to Vault! This guide is the best place to start with Vault. We cover what Vault is, what problems it can solve, how it compares to existing software, and contains a quick start for using Vault.",
		    "page_title": "Introduction",
		  },
		  "githubFileUrl": "https://hashicorp.com/src/views/docs-view/loaders/__fixtures__/index.mdx",
		  "mdxSource": {
		    "compiledSource": Any<String>,
		    "scope": {
		      "version": "latest",
		    },
		  },
		  "navData": Any<Array>,
		  "versions": [],
		}
	`
		)
	})

	test('mdxContentHook is called if provided', async () => {
		mockMdxContentHook.mockImplementation((mdxContent, scope) => 'Mock impl')

		const l = new FileSystemLoader({
			navDataFile: 'test',
			localContentDir: CONTENT_DIR,
			product: 'waypoint',
			githubFileUrl(p) {
				return `https://hashicorp.com/${p}`
			},
			mdxContentHook: mockMdxContentHook,
			scope: { version: 'latest' },
		})

		await l.loadStaticProps({ params: {} })

		expect(mockMdxContentHook).toHaveBeenCalledWith(expect.any(String), {
			product: 'waypoint',
			version: 'latest',
		})
		// assert that `serialize` is called with the result of the hook
		expect(serializeSpy).toHaveBeenCalledWith('Mock impl', expect.any(Object))
	})
})
