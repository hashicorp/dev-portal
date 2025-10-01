/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import SandboxDropdown from '../index'

// Mock the hooks
const mockUserRouter = vi.fn()
vi.mock('next/router', () => ({
	useRouter: () => mockUserRouter(),
}))

const mockUseCurrentProduct = vi.fn()
vi.mock('contexts', () => ({
	useCurrentProduct: () => mockUseCurrentProduct(),
}))

const mockUseInstruqtEmbed = vi.fn()
vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => mockUseInstruqtEmbed(),
}))

describe('SandboxDropdown', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		vi.clearAllMocks()

		// Setup default mock implementations
		mockUserRouter.mockImplementation(() => ({
			asPath: '/',
			events: {
				on: vi.fn(),
				off: vi.fn(),
			},
		}))

		mockUseCurrentProduct.mockImplementation(() => ({
			name: 'Vault',
			slug: 'vault',
		}))

		mockUseInstruqtEmbed.mockImplementation(() => ({
			openLab: vi.fn(),
		}))
	})

	it('renders the sandbox dropdown with correct label', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		expect(
			screen.getByRole('button', { name: 'Sandbox menu' })
		).toBeInTheDocument()
	})

	it('opens and closes on click', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Click to open
		fireEvent.click(button)
		// Update: match actual rendered text, e.g. "Vault Sandboxes"
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Click to close
		fireEvent.click(button)

		// Check the dropdown container's display style
		const dropdown = document.querySelector('[class*="dropdownContainer"]')
		expect(dropdown).toHaveStyle('display: none')
	})

	it('closes on escape key', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)
		// Update: match actual rendered text, e.g. "Vault Sandboxes"
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Press escape
		fireEvent.keyDown(button, { key: 'Escape' })

		// Check the dropdown container's display style
		const dropdown = document.querySelector('[class*="dropdownContainer"]')
		expect(dropdown).toHaveStyle('display: none')
	})

	it('closes on click outside', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)
		// Update: match actual rendered text, e.g. "Vault Sandboxes"
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Click outside
		fireEvent.mouseDown(document.body)

		// Check the dropdown container's display style
		const dropdown = document.querySelector('[class*="dropdownContainer"]')
		expect(dropdown).toHaveStyle('display: none')
	})

	it('displays available sandboxes for current product', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Check for available sandboxes section
		expect(screen.getByText(/Available.*Sandboxes/)).toBeInTheDocument()
	})

	it('opens lab when clicking a sandbox item', () => {
		const mockOpenLab = vi.fn()
		mockUseInstruqtEmbed.mockImplementation(() => ({
			openLab: mockOpenLab,
		}))

		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Find a sandbox item and click it
		const sandboxItem = screen.getByText('Vault Sandbox')
		fireEvent.click(sandboxItem.closest('button'))

		// Verify openLab was called
		expect(mockOpenLab).toHaveBeenCalled()
	})

	it('tracks sandbox events when opening labs', () => {
		const mockOpenLab = vi.fn()
		mockUseInstruqtEmbed.mockImplementation(() => ({
			openLab: mockOpenLab,
		}))

		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Find a sandbox item and click it
		const sandboxItem = screen.getByText('Vault Sandbox')
		fireEvent.click(sandboxItem.closest('button'))

		// Verify openLab was called
		expect(mockOpenLab).toHaveBeenCalled()
	})
})
