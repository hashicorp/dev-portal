import parseHighlightedLines from './parse-highlighted-lines'

const happyFixtures = [
	{
		id: 'should return an empty array for an empty string',
		input: '',
		expected: [],
	},
	{
		id: 'should handle a single integer',
		input: '3',
		expected: [3],
	},
	{
		id: 'should handle a single range of integers',
		input: '4-8',
		expected: [4, 5, 6, 7, 8],
	},
	{
		id: 'should handle multiple integers',
		input: '3,4,5',
		expected: [3, 4, 5],
	},
	{
		id: 'should handle multiple ranges',
		input: '3-5,8-10',
		expected: [3, 4, 5, 8, 9, 10],
	},
	{
		id: 'should handle a mix of integers and ranges',
		input: '3,5-7,9,11-14',
		expected: [3, 5, 6, 7, 9, 11, 12, 13, 14],
	},
]

const errorFixtures = [
	{
		id: 'should throw an error for number (or any non-string) input',
		input: 3,
		expectedError:
			'The highlight prop must be a string. Received a value of type "number" instead.',
	},
	{
		id: 'should throw an error for invalid characters',
		input: '4.1-10',
		expectedError:
			'The highlight prop must be a comma-separated list of single integers or ranges with a single dash between two integers. Found invalid characters: "4.1-10".',
	},
	{
		id: 'should throw an error for ranges with too many dashes',
		input: '4-8-10',
		expectedError:
			'Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a value with multiple dashes: "4-8-10".',
	},
	{
		id: 'should throw an error for trailing commas',
		input: '3,4,',
		expectedError:
			'Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a value that parsed to NaN: "<empty string>".',
	},
	{
		id: 'should throw an error for trailing ranges',
		input: '3,4-,5',
		expectedError:
			'Each comma-separated value in the highlight prop must be either a single integer, or a range with a single dash between two integers. Found a range that produced a NaN: "4-".',
	},
]

happyFixtures.forEach(({ id, input, expected }) => {
	it(id, () => expect(parseHighlightedLines(input)).toEqual(expected))
})

errorFixtures.forEach(({ id, input, expectedError }) => {
	it(id, () => {
		//  Suppress console.error for this test, we expect an error
		vi.spyOn(console, 'error').mockImplementation(vi.fn())
		expect(() => {
			parseHighlightedLines(input as any)
		}).toThrowError(expectedError)
	})
})
