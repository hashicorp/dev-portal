/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import { createContext } from 'react'
import { SkipLinkContext } from '../skip-link'

describe('SkipLinkContext', () => {
	it('should create a context with initial value of null', () => {
		const { Provider } = SkipLinkContext
		const value = createContext(null)

		const { container } = render(
			<Provider value={value}>
				<div>Test Component</div>
			</Provider>
		)

		expect(container).toBeInTheDocument()
	})
})
