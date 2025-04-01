/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { render, cleanup } from '@testing-library/react'

import Collapsible from '.'

afterEach(cleanup)

describe('<Collapsible />', () => {
	it('should render text children', () => {
		const someText = 'This is some test text for this test'
		const { getByText } = render(<Collapsible>{someText}</Collapsible>)
		expect(getByText(someText)).toBeInTheDocument()
	})

	it('should render arbitrary React children', () => {
		const altText = 'Alt text on an image element'
		const { getByAltText } = render(
			<Collapsible>
				<img src="" alt={altText} />
			</Collapsible>
		)
		expect(getByAltText(altText)).toBeInTheDocument()
	})
})
