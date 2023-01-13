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
				{
					input: './configuration',
					expected: '/docs/disks/configuration',
					currentPath: '/docs/disks',
				},
				{
					input: './hyperv/common-issues',
					expected: '/docs/disks/hyperv/common-issues',
					currentPath: '/docs/disks',
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
