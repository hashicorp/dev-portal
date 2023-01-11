import { preAdjustUrl } from 'lib/remark-plugin-adjust-link-urls'

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
					input: {
						currentPath: '/docs/plugins/go-plugins/guests',
						url: '../guest-capabilities',
					},
					expected: '/docs/plugins/guest-capabilities',
				},
				{
					input: {
						currentPath: '/docs/plugins/go-plugins/guests',
						url: '../../multi-machine',
					},
					expected: '/docs/multi-machine',
				},
				{
					input: {
						currentPath: '/docs/plugins/go-plugins/guests',
						url: '../../share/connect',
					},
					expected: '/docs/share/connect',
				},
			]
			test.each(testCases)('$input.url -> $expected', ({ input, expected }) => {
				expect(preAdjustUrl(input)).toBe(expected)
			})
		})

		describe('pre-adjusts folder-relative urls starting with `./`', () => {
			const testCases = [
				{
					input: {
						currentPath: '/docs/disks',
						url: './configuration',
					},
					expected: '/docs/disks/configuration',
				},
				{
					input: {
						currentPath: '/docs/disks',
						url: './hyperv/common-issues',
					},
					expected: '/docs/disks/hyperv/common-issues',
				},
			]
			test.each(testCases)('$input.url -> $expected', ({ input, expected }) => {
				expect(preAdjustUrl(input)).toBe(expected)
			})
		})

		describe('pre-adjusts urls that start with a path part of the given currentPath', () => {
			const mockCurrentPath = '/docs/waypoint-hcl/variables'
			const urlsToTest = [
				['variables/input', '/docs/waypoint-hcl/variables/input'],
				['waypoint-hcl/app', '/docs/waypoint-hcl/app'],
			]

			test.each(urlsToTest)(
				'"%s" is pre-adjusted to "%s"',
				(input: string, expectedOutput: string) => {
					expect(
						preAdjustUrl({ currentPath: mockCurrentPath, url: input })
					).toEqual(expectedOutput)
				}
			)
		})

		describe('does not pre-adjust urls that do not start with a path part of the given currentPath', () => {
			const mockCurrentPath = '/docs/waypoint-hcl/variables'
			const urlsToTest = ['some/other/path', '']

			test.each(urlsToTest)('"%s" is not pre-adjusted', (url: string) => {
				expect(preAdjustUrl({ currentPath: mockCurrentPath, url })).toEqual(url)
			})
		})
	})
})
