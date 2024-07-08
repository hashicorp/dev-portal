/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen } from '@testing-library/react'

import ImageConfig from '.'

const testImage = (
	<img alt="hashicorp logo" src="/img/favicons/favicon-192x192.png" />
)

/**
 * this is an approximation of this component's markup when used within an MDX document, eg:
 * <ImageConfig>
 *
 *   ![hashicorp logo](/img/favicons/favicon-192x192.png)
 *
 * </ImageConfig>
 */
const renderBasicMock = () =>
	render(
		<ImageConfig hideBorder>
			<p className="g-type-long-body">{testImage}</p>
		</ImageConfig>
	)

describe('basic functionality', () => {
	//  silence console.warn
	const mockConsoleWarn = vi.spyOn(console, 'warn')
	beforeAll(() => {
		mockConsoleWarn.mockImplementation(() => null)
	})
	afterAll(() => {
		mockConsoleWarn.mockRestore()
	})

	it('should render children', () => {
		render(<ImageConfig>{testImage}</ImageConfig>)

		expect(screen.getByAltText('hashicorp logo')).toBeInTheDocument()
	})

	it('should apply `noBorder` styling if `hideBorder` is provided', () => {
		renderBasicMock()
		const mdxImgContainer = screen.getByAltText('hashicorp logo').parentNode
		expect(mdxImgContainer).toHaveClass(/noBorder/)
	})
})

describe('errors', () => {
	//  silence console.error, otherwise the test will fail
	const mockConsoleError = vi.spyOn(console, 'error')
	beforeAll(() => {
		mockConsoleError.mockImplementation(() => null)
	})
	afterAll(() => {
		mockConsoleError.mockRestore()
	})

	it('should error with invalid children', () => {
		expect(() => render(<ImageConfig> </ImageConfig>)).toThrowError()
		expect(() => render(<ImageConfig>{4}</ImageConfig>)).toThrowError()
		expect(() =>
			render(<ImageConfig>{'some-string'}</ImageConfig>)
		).toThrowError()
	})

	it('should error with multiple children', () => {
		expect(() =>
			render(
				<ImageConfig>
					{testImage}
					{testImage}
				</ImageConfig>
			)
		).toThrowError()
	})
})
