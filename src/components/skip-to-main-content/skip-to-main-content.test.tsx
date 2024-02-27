/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { render, screen } from '@testing-library/react'
import SkipToMainContent from '.'
import { SkipLinkContext } from 'contexts'

const renderWithSkipLinkContext = (showSkipLink) => {
	return render(
		<SkipLinkContext.Provider value={{ showSkipLink }}>
			<SkipToMainContent />
		</SkipLinkContext.Provider>
	)
}

describe('SkipToMainContent', () => {
	it('renders skip link when showSkipLink is true', () => {
		renderWithSkipLinkContext(true)
		expect(screen.getByText('Skip to main content')).toBeInTheDocument()
	})

	it('does not render skip link when showSkipLink is false', () => {
		renderWithSkipLinkContext(false)
		expect(screen.queryByText('Skip to main content')).toBeNull()
	})
})
