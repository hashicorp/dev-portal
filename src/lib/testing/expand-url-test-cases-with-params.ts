interface TestCase extends Record<string, unknown> {
	input: string
	expected: string
}

const URL_SUFFIXES = ['', '?param=value', '#heading', '?param=value#heading']

/**
 * Given a list of test cases, returns a new array with three additional case
 * for each original case:
 *
 *  - the original URL + a query parameter string
 *  - the original URL + an anchor hash
 *  - the original URL + a query parameter string + an anchor hash
 *
 * @NOTE Any additional properties on each test case object WILL be preserved.
 */
const expandUrlTestCasesWithParams = (testCases: TestCase[]) => {
	const expandedTestCases = []

	testCases.forEach(({ input, expected, ...rest }: TestCase) => {
		URL_SUFFIXES.forEach((suffix: string) => {
			const expandedInput =
				typeof input === 'string' && input.length > 0
					? `${input}${suffix}`
					: input
			const expandedExpected =
				typeof expected === 'string' && expected.length > 0
					? `${expected}${suffix}`
					: expected
			const expandedTestCase = {
				input: expandedInput,
				expected: expandedExpected,
				...rest,
			}
			expandedTestCases.push(expandedTestCase)
		})
	})

	return expandedTestCases
}

export type { TestCase }
export { expandUrlTestCasesWithParams }
