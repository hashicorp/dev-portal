import { preAdjustUrl } from 'lib/remark-plugin-adjust-link-urls'

describe('remarkPluginAdjustLinkUrls', () => {
	describe('preAdjustUrl', () => {
		describe('does not pre-adjust urls that start with: `.`, `/`, `?`, `#`', () => {
			const mockCurrentPath = '/some/docs/path'
			const urlsToTest = [
				'../oneLevelUp',
				'./differentPageAtCurrentLevel',
				'/root/level/page',
				'?paramKey=paramValue',
				'#page-anchor',
			]

			test.each(urlsToTest)('"%s" is not pre-adjusted', (url: string) => {
				expect(preAdjustUrl({ currentPath: mockCurrentPath, url })).toEqual(url)
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
