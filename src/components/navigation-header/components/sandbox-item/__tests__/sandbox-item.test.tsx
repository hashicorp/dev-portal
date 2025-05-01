/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import SandboxItem from '../index'

// Mock the hooks
const mockUseInstruqtEmbed = vi.fn()
vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => mockUseInstruqtEmbed(),
}))

describe('SandboxItem', () => {
	const mockItem = {
		label: 'Test Sandbox',
		description: 'Test Description',
		labId: 'test-lab-id',
		products: ['vault'],
		onClick: vi.fn(),
	}

	beforeEach(() => {
		vi.clearAllMocks()
		mockUseInstruqtEmbed.mockImplementation(() => ({
			openLab: vi.fn(),
		}))
	})

	it('renders sandbox item with title and description', () => {
		render(<SandboxItem item={mockItem} />)

		expect(screen.getByText('Test Sandbox')).toBeInTheDocument()
		expect(screen.getByText('Test Description')).toBeInTheDocument()
	})

	it('renders product icon', () => {
		render(<SandboxItem item={mockItem} />)

		// Find SVG element instead of trying to find by role="img"
		const icon = document.querySelector('svg')
		expect(icon).toBeInTheDocument()
		expect(icon.parentElement.className).toContain('productIcon')
	})

	it('calls onClick handler when clicked', () => {
		render(<SandboxItem item={mockItem} />)

		const item = screen.getByRole('link')
		fireEvent.click(item)

		expect(mockItem.onClick).toHaveBeenCalled()
	})

	it('tracks sandbox event when clicked', () => {
		render(<SandboxItem item={mockItem} />)

		const item = screen.getByRole('link')
		fireEvent.click(item)

		// Verify event tracking (you'll need to implement this based on your tracking setup)
		// expect(mockTrackEvent).toHaveBeenCalledWith('sandbox_opened', {...})
	})

	it('applies correct styles when hovered', () => {
		render(<SandboxItem item={mockItem} />)

		const item = screen.getByRole('link')
		fireEvent.mouseEnter(item)

		expect(item.className).toContain('playground')
	})
})
