/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import Image from 'components/image'

describe('image component', () => {
	it('adds a `data-hide-on-theme` attribute when hash is passed', async () => {
		const { getByAltText } = render(
			<Image
				src="/img/themed/dark-test.png#hide-on-light"
				alt="dark theme test"
			/>
		)
		const image = getByAltText('dark theme test')
		expect(image.parentElement).toHaveAttribute('data-hide-on-theme', 'light')
	})

	it('only matches the `hide-on-{theme}` hash pattern', async () => {
		const { getByAltText } = render(
			<Image src="/img/themed/dark-test.png#bora-bora-theme" alt="test" />
		)
		const image = getByAltText('test')
		expect(image.parentElement).not.toHaveAttribute('data-hide-on-theme')
	})

	it('renders a plain image without the data-hide-on-theme attribute ', async () => {
		const { getByAltText } = render(
			<Image src="/img/themed/dark-test.png" alt="plain test" />
		)
		const image = getByAltText('plain test')

		expect(image).toBeInTheDocument()
		expect(image.parentElement).not.toHaveAttribute('data-hide-on-theme')
	})
})
