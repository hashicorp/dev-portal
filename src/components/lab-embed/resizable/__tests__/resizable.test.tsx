/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import Resizable from '../index'
import s from '../resizable.module.css'

// Mock the useInstruqtEmbed hook
const mockUseInstruqtEmbed = vi.fn()
vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => mockUseInstruqtEmbed(),
}))

describe('Resizable', () => {
	const mockSetPanelActive = vi.fn()
	const mockCloseLab = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		mockUseInstruqtEmbed.mockImplementation(() => ({
			closeLab: mockCloseLab,
		}))
	})

	it('renders children when panel is active', () => {
		render(
			<Resizable
				panelActive={true}
				setPanelActive={mockSetPanelActive}
				initialHeight={400}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		expect(screen.getByTestId('test-child')).toBeInTheDocument()
	})

	it('does not render children when panel is not active', () => {
		render(
			<Resizable
				panelActive={false}
				setPanelActive={mockSetPanelActive}
				initialHeight={400}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		// Check that the main resizable container has the 'hide' class
		const resizableContainer = screen
			.getByTestId('test-child')
			.closest('div._resizable_17d1f1')
		expect(resizableContainer).toHaveClass(s.hide)

		// Also ensure the child itself is not directly queried if hidden by parent
		expect(screen.queryByTestId('test-child')).toBeInTheDocument() // It should exist in the DOM
	})

	it('has the correct initial height', () => {
		render(
			<Resizable
				panelActive={true}
				setPanelActive={mockSetPanelActive}
				initialHeight={500}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		const resizableDiv = screen
			.getByTestId('test-child')
			.closest('div[data-resizing]')
		expect(resizableDiv).toHaveStyle('height: 500px')
	})

	it('calls closeLab when close button is clicked', () => {
		render(
			<Resizable
				panelActive={true}
				setPanelActive={mockSetPanelActive}
				initialHeight={400}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		const closeButton = screen.getByRole('button', { name: /close/i })
		fireEvent.click(closeButton)

		expect(mockCloseLab).toHaveBeenCalled()
	})

	it('starts resizing when resizer is clicked', () => {
		render(
			<Resizable
				panelActive={true}
				setPanelActive={mockSetPanelActive}
				initialHeight={400}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		const resizer = screen.getByRole('button', { name: /resize/i })
		fireEvent.mouseDown(resizer, { screenY: 100 })

		const resizableDiv = screen
			.getByTestId('test-child')
			.closest('div[data-resizing]')
		expect(resizableDiv).toHaveAttribute('data-resizing', 'true')
	})

	it('changes height during resizing', () => {
		render(
			<Resizable
				panelActive={true}
				setPanelActive={mockSetPanelActive}
				initialHeight={400}
				style={{}}
			>
				<div data-testid="test-child">Child content</div>
			</Resizable>
		)

		const resizer = screen.getByRole('button', { name: /resize/i })
		fireEvent.mouseDown(resizer, { screenY: 500 })

		// Simulate mouse move
		fireEvent.mouseMove(window, { screenY: 450 })

		const resizableDiv = screen
			.getByTestId('test-child')
			.closest('div[data-resizing]')
		expect(resizableDiv).toHaveStyle('height: 450px')

		// Simulate mouse up to stop resizing
		fireEvent.mouseUp(window)
		expect(resizableDiv).toHaveAttribute('data-resizing', 'false')
	})
})
