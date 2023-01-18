import {
	expandUrlTestCasesWithParams,
	TestCase,
} from 'lib/testing/expand-url-test-cases-with-params'
import { preAdjustUrl } from 'lib/remark-plugins/remark-plugin-adjust-link-urls/helpers'

const testEachCase = (testCases: TestCase[]) => {
	const allCases = expandUrlTestCasesWithParams(testCases)
	test.each(allCases)(
		'$input -> $expected',
		({ input, expected, currentPath }: TestCase) => {
			expect(preAdjustUrl({ currentPath, url: input })).toBe(expected)
		}
	)
}

describe('remarkPluginAdjustLinkUrls', () => {
	describe('preAdjustUrl', () => {
		describe('does not pre-adjust query strings or anchors', () => {
			const mockCurrentPath = '/some/docs/path'
			const urlsToTest = [
				'.',
				'.invalid/folder/relative',
				'?param=value',
				'#heading',
				'?param=value#heading',
			]
			test.each(urlsToTest)('"%s" is not pre-adjusted', (url: string) => {
				expect(preAdjustUrl({ currentPath: mockCurrentPath, url })).toEqual(url)
			})
		})

		describe('pre-adjusts developer.hashicorp.com links to internal paths', () => {
			const testCases = [
				{
					input: 'https://developer.hashicorp.com',
					expected: '/',
					currentPath: 'mock-path',
				},
				{
					input: 'https://developer.hashicorp.com/',
					expected: '/',
					currentPath: 'mock-path',
				},
				{
					input: 'https://developer.hashicorp.com/vault',
					expected: '/vault',
					currentPath: 'mock-path',
				},
				{
					input: 'https://developer.hashicorp.com/vault/docs',
					expected: '/vault/docs',
					currentPath: 'mock-path',
				},
			]
			testEachCase(testCases)
		})

		describe('pre-adjusts folder-relative urls starting with `../`', () => {
			const testCases = [
				{
					input: '../guest-capabilities',
					expected: '/docs/plugins/guest-capabilities',
					currentPath: '/docs/plugins/go-plugins/guests',
				},
				{
					input: '../../multi-machine',
					expected: '/docs/multi-machine',
					currentPath: '/docs/plugins/go-plugins/guests',
				},
				{
					input: '../../share/connect',
					expected: '/docs/share/connect',
					currentPath: '/docs/plugins/go-plugins/guests',
				},
			]
			testEachCase(testCases)
		})

		describe('pre-adjusts folder-relative urls starting with `./`', () => {
			const testCases = [
				// Example of test case:
				// https://github.com/hashicorp/waypoint/blob/63d5149a2aa63214f6f5fa41e825cb1a13783b9e/website/content/plugins/aws-ecs.mdx?plain=1#L17
				{
					input: './pack',
					expected: '/plugins/pack',
					currentPath: '/plugins/aws-ecs',
				},
				// Example of test case:
				// https://github.com/hashicorp/terraform-plugin-sdk/blob/8058e8060ef488d9881645ad9cad0872cdff3094/website/docs/plugin/sdkv2/logging/index.mdx?plain=1#L25
				{
					input: './logging/http-transport',
					expected: '/plugin/sdkv2/logging/http-transport',
					currentPath: '/plugin/sdkv2/logging',
				},
			]
			testEachCase(testCases)
		})

		describe('pre-adjusts urls that start with a path part of the given currentPath', () => {
			const mockCurrentPath = '/docs/waypoint-hcl/variables'
			const urlsToTest = [
				{
					input: 'variables/input',
					expected: '/docs/waypoint-hcl/variables/input',
					currentPath: mockCurrentPath,
				},
				{
					input: 'waypoint-hcl/app',
					expected: '/docs/waypoint-hcl/app',
					currentPath: mockCurrentPath,
				},
				{
					input: 'api-docs/secret/kv/kv-v2',
					expected: '/api-docs/secret/kv/kv-v2',
					currentPath: '/api-docs',
				},
				{
					input: 'api/secret/kv/kv-v2',
					expected: '/api-docs/secret/kv/kv-v2',
					currentPath: '/api-docs',
				},
			]
			testEachCase(urlsToTest)
		})

		describe('does not pre-adjust urls that do not start with a path part of the given currentPath', () => {
			const urlsToTest = [
				{
					input: 'some/other/path',
					expected: 'some/other/path',
					currentPath: '/docs/waypoint-hcl/variables',
				},
			]
			testEachCase(urlsToTest)
		})
	})
})
