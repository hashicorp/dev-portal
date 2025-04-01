/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen } from '@testing-library/react'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import EmbedElement from '../index'

// Mock the useInstruqtEmbed hook
const mockUseInstruqtEmbed = vi.fn()
vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => mockUseInstruqtEmbed(),
}))

describe('EmbedElement', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockUseInstruqtEmbed.mockImplementation(() => ({
			active: true,
			labId: 'test-lab-id',
		}))
	})

	it('renders an iframe with the correct props', () => {
		render(<EmbedElement />)

		const iframe = screen.getByTitle('Instruqt')
		expect(iframe).toBeInTheDocument()
		expect(iframe.tagName).toBe('IFRAME')
		expect(iframe).toHaveAttribute(
			'src',
			'https://play.instruqt.com/embed/test-lab-id'
		)
		expect(iframe).toHaveAttribute(
			'sandbox',
			'allow-same-origin allow-scripts allow-popups allow-forms allow-modals'
		)
	})

	it('has proper focus behavior when mounted', () => {
		const { container } = render(<EmbedElement />)

		const iframe = screen.getByTitle('Instruqt')
		expect(document.activeElement).toBe(iframe)
	})

	it('has the correct styles when active', () => {
		render(<EmbedElement />)

		const iframe = screen.getByTitle('Instruqt')
		expect(iframe.className).not.toContain('_hide_')
	})

	it('has the correct styles when not active', () => {
		// Mock the hook to return active: false
		mockUseInstruqtEmbed.mockImplementation(() => ({
			active: false,
			labId: 'test-lab-id',
		}))

		render(<EmbedElement />)

		const iframe = screen.getByTitle('Instruqt')
		expect(iframe.className).toContain('_hide_')
	})
})
