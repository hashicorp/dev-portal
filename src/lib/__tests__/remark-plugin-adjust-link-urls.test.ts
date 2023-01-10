import remark from 'remark'
import { ProductData, ProductSlug, RootDocsPath } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs, productSlugsToHostNames } from 'lib/products'
import remarkPluginAdjustLinkUrls, {
	preAdjustUrl,
} from 'lib/remark-plugin-adjust-link-urls'
import { getProductUrlAdjuster } from 'views/docs-view/utils/product-url-adjusters'

describe('remarkPluginAdjustLinkUrls', () => {
	describe('preAdjustUrl helper', () => {
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

	describe('plugin tests', () => {
		const URL_SUFFIXES = [
			'',
			'?param=value',
			'#heading',
			'?param=value#heading',
		]

		interface TestCase {
			input: string
			expected: string
		}

		const testEachCase = (product: ProductData, testCases: TestCase[]) => {
			const productUrlAdjuster = getProductUrlAdjuster(product)

			// Add a test case for each URL_SUFFIX
			const allTestCases = []
			testCases.forEach(({ input, expected }: TestCase) => {
				URL_SUFFIXES.forEach((suffix: string) => {
					allTestCases.push({
						input: `${input}${suffix}`,
						expected: `${expected}${suffix}`,
					})
				})
			})

			test.each(allTestCases)(
				'$input -> $expected',
				async ({ input, expected }: TestCase) => {
					const result = await remark()
						.use(remarkPluginAdjustLinkUrls, {
							urlAdjustFn: productUrlAdjuster,
						})
						.process(`[test](${input})`)
					expect(result.contents).toMatch(`[test](${expected})`)
				}
			)
		}

		describe('does not change external .io links', () => {
			Object.entries(productSlugsToHostNames).forEach(
				([productSlug, hostname]: [ProductSlug, string]) => {
					// TODO add cases for sentinel?
					if (productSlug === 'sentinel') {
						return
					}

					const productData = cachedGetProductData(productSlug)
					describe(productSlug, () => {
						const testCases = []

						productData.rootDocsPaths.forEach((rootDocsPath: RootDocsPath) => {
							const url = `https://${hostname}/${rootDocsPath.path}`
							testCases.push({
								input: url,
								expected: url,
							})
							testCases.push({
								input: `${url}/some/path`,
								expected: `${url}/some/path`,
							})
						})

						testEachCase(productData, testCases)
					})
				}
			)
		})
	})
})
