/* eslint-disable @typescript-eslint/no-empty-function */
import { ProductSlug } from 'types/products'
import * as utils from '../utils'
import { rewriteTutorialsLink } from '../'

jest.mock('../utils')

jest.mock('lib/get-is-beta-product', () => (productSlug: ProductSlug) => {
	return ['vault', 'waypoint'].includes(productSlug)
})

describe('rewriteTutorialsLink', () => {
	jest.spyOn(console, 'error').mockImplementation(jest.fn())
	jest.spyOn(utils, 'getIsExternalDocsLink').mockImplementation(jest.fn())
	jest.spyOn(utils, 'getIsLearnLink').mockImplementation(jest.fn())
	jest.spyOn(utils, 'handleDocsLink').mockImplementation(jest.fn())
	jest.spyOn(utils, 'handleLearnLink').mockImplementation(jest.fn())

	const mockConsoleError = console.error as jest.Mock
	const mockGetIsExternalDocsLink = utils.getIsExternalDocsLink as jest.Mock
	const mockGetIsLearnLink = utils.getIsLearnLink as jest.Mock
	const mockHandleDocsLink = utils.handleDocsLink as jest.Mock
	const mockHandleLearnLink = utils.handleLearnLink as jest.Mock

	afterEach(() => {
		mockConsoleError.mockClear()
		mockGetIsExternalDocsLink.mockClear()
		mockGetIsLearnLink.mockClear()
		mockHandleDocsLink.mockClear()
		mockHandleLearnLink.mockClear()
	})

	afterAll(() => {
		jest.restoreAllMocks()
	})

	test('when link is neither learn nor docs link', () => {
		mockGetIsExternalDocsLink.mockReturnValueOnce(false)
		mockGetIsLearnLink.mockReturnValueOnce(false)

		expect(rewriteTutorialsLink('test-link', {})).toEqual('test-link')

		expect(mockGetIsExternalDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsLearnLink).toHaveBeenCalledTimes(1)
		expect(mockHandleDocsLink).toHaveBeenCalledTimes(0)
		expect(mockHandleLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(1)
	})

	test('when link is a learn link, not a docs link', () => {
		mockGetIsExternalDocsLink.mockReturnValueOnce(false)
		mockGetIsLearnLink.mockReturnValueOnce(true)
		mockHandleLearnLink.mockReturnValueOnce('mocked-return-value')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('mocked-return-value')

		expect(mockGetIsExternalDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsLearnLink).toHaveBeenCalledTimes(1)
		expect(mockHandleDocsLink).toHaveBeenCalledTimes(0)
		expect(mockHandleLearnLink).toHaveBeenCalledTimes(1)
		expect(mockConsoleError).toHaveBeenCalledTimes(0)
	})

	test('when link is a docs link, not a learn link', () => {
		mockGetIsExternalDocsLink.mockReturnValueOnce(true)
		mockGetIsLearnLink.mockReturnValueOnce(false)
		mockHandleDocsLink.mockReturnValueOnce('mocked-return-value')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('mocked-return-value')

		expect(mockGetIsExternalDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsLearnLink).toHaveBeenCalledTimes(1)
		expect(mockHandleDocsLink).toHaveBeenCalledTimes(1)
		expect(mockHandleLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(0)
	})

	test('when the link is both a learn and a docs link', () => {
		mockGetIsExternalDocsLink.mockReturnValueOnce(true)
		mockGetIsLearnLink.mockReturnValueOnce(true)
		mockHandleDocsLink.mockReturnValueOnce('mocked-handle-docs-link-value')
		mockHandleLearnLink.mockReturnValueOnce('mocked-handle-learn-link-value')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('test-link')

		expect(mockGetIsExternalDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsLearnLink).toHaveBeenCalledTimes(1)
		expect(mockHandleDocsLink).toHaveBeenCalledTimes(0)
		expect(mockHandleLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(1)
	})
})
