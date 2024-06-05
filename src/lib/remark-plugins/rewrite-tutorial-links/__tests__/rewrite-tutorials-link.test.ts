/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/* eslint-disable @typescript-eslint/no-empty-function */
import * as utils from '../utils'
import { rewriteTutorialsLink } from '../utils/rewrite-tutorials-link'
import type { Mock } from 'vitest'

vi.mock('../utils')

describe('rewriteTutorialsLink', () => {
	vi.spyOn(console, 'error').mockImplementation(vi.fn())
	vi.spyOn(utils, 'getIsRewriteableDocsLink').mockImplementation(vi.fn())
	vi.spyOn(utils, 'getIsExternalLearnLink').mockImplementation(vi.fn())
	vi.spyOn(utils, 'rewriteExternalDocsLink').mockImplementation(vi.fn())
	vi.spyOn(utils, 'rewriteExternalLearnLink').mockImplementation(vi.fn())

	const mockConsoleError = console.error as Mock
	const mockGetIsRewriteableDocsLink = utils.getIsRewriteableDocsLink as Mock
	const mockGetIsRewriteableLearnLink = utils.getIsExternalLearnLink as Mock
	const mockRewriteExternalLearnLink = utils.rewriteExternalLearnLink as Mock
	const mockRewriteExternalDocsLink = utils.rewriteExternalDocsLink as Mock

	afterEach(() => {
		mockConsoleError.mockClear()
		mockGetIsRewriteableDocsLink.mockClear()
		mockGetIsRewriteableLearnLink.mockClear()
		mockRewriteExternalDocsLink.mockClear()
		mockRewriteExternalLearnLink.mockClear()
	})

	afterAll(() => {
		vi.restoreAllMocks()
	})

	test('when link is neither learn nor docs link', () => {
		mockGetIsRewriteableDocsLink.mockReturnValueOnce(false)
		mockGetIsRewriteableLearnLink.mockReturnValueOnce(false)

		expect(rewriteTutorialsLink('test-link', {})).toEqual('test-link')

		expect(mockGetIsRewriteableDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsRewriteableLearnLink).toHaveBeenCalledTimes(1)
		expect(mockRewriteExternalDocsLink).toHaveBeenCalledTimes(0)
		expect(mockRewriteExternalLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(0)
	})

	test('when link is a learn link, not a docs link', () => {
		mockGetIsRewriteableDocsLink.mockReturnValueOnce(false)
		mockGetIsRewriteableLearnLink.mockReturnValueOnce(true)
		mockRewriteExternalLearnLink.mockReturnValueOnce('mocked-return-value')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('mocked-return-value')

		expect(mockGetIsRewriteableDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsRewriteableLearnLink).toHaveBeenCalledTimes(1)
		expect(mockRewriteExternalDocsLink).toHaveBeenCalledTimes(0)
		expect(mockRewriteExternalLearnLink).toHaveBeenCalledTimes(1)
		expect(mockConsoleError).toHaveBeenCalledTimes(0)
	})

	test('when link is a docs link, not a learn link', () => {
		mockGetIsRewriteableDocsLink.mockReturnValueOnce(true)
		mockGetIsRewriteableLearnLink.mockReturnValueOnce(false)
		mockRewriteExternalDocsLink.mockReturnValueOnce('mocked-return-value')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('mocked-return-value')

		expect(mockGetIsRewriteableDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsRewriteableLearnLink).toHaveBeenCalledTimes(1)
		expect(mockRewriteExternalDocsLink).toHaveBeenCalledTimes(1)
		expect(mockRewriteExternalLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(0)
	})

	test('when the link is both a learn and a docs link', () => {
		mockGetIsRewriteableDocsLink.mockReturnValueOnce(true)
		mockGetIsRewriteableLearnLink.mockReturnValueOnce(true)
		mockRewriteExternalDocsLink.mockReturnValueOnce('mocked-docs-link')
		mockRewriteExternalLearnLink.mockReturnValueOnce('mocked-learn-link')

		expect(rewriteTutorialsLink('test-link', {})).toEqual('test-link')

		expect(mockGetIsRewriteableDocsLink).toHaveBeenCalledTimes(1)
		expect(mockGetIsRewriteableLearnLink).toHaveBeenCalledTimes(1)
		expect(mockRewriteExternalDocsLink).toHaveBeenCalledTimes(0)
		expect(mockRewriteExternalLearnLink).toHaveBeenCalledTimes(0)
		expect(mockConsoleError).toHaveBeenCalledTimes(1)
	})
})
