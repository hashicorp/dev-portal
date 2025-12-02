/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import SandboxDropdown from '../index'

// Mock the hooks and functions
const mockUserRouter = vi.fn()
vi.mock('next/router', () => ({
	useRouter: () => mockUserRouter(),
}))

const mockUseCurrentProduct = vi.fn()
vi.mock('contexts', () => ({
	useCurrentProduct: () => mockUseCurrentProduct(),
}))

const openLabSpy = vi.fn()
const setActiveSpy = vi.fn()

vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => ({
		openLab: openLabSpy,
		setActive: setActiveSpy,
		labId: null,
		active: false,
		closeLab: vi.fn(),
		hasConfigError: false,
		configErrors: [],
		labSource: null,
		tutorialLabId: null,
	}),
}))

const mockTrackSandboxInteraction = vi.fn()
vi.mock('views/sandbox-view/utils', () => ({
	trackSandboxInteraction: (...args: unknown[]) =>
		mockTrackSandboxInteraction(...args),
}))

const mockTrackSandboxEvent = vi.fn()
vi.mock('lib/posthog-events', () => ({
	trackSandboxEvent: (...args: unknown[]) => mockTrackSandboxEvent(...args),
	SANDBOX_EVENT: {
		SANDBOX_OPEN: 'sandbox_open',
	},
}))

describe('SandboxDropdown', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		openLabSpy.mockClear()
		setActiveSpy.mockClear()
		mockTrackSandboxInteraction.mockClear()
		mockTrackSandboxEvent.mockClear()

		mockUserRouter.mockImplementation(() => ({
			asPath: '/',
			push: vi.fn().mockResolvedValue(true),
			events: {
				on: vi.fn(),
				off: vi.fn(),
			},
			query: {},
		}))

		mockUseCurrentProduct.mockImplementation(() => ({
			name: 'Vault',
			slug: 'vault',
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
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Click to close
		fireEvent.click(button)

		// Dropdown should not be in DOM when closed (portal renders conditionally)
		expect(screen.queryByText('Vault Sandboxes')).not.toBeInTheDocument()
	})

	it('closes on escape key', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Press escape
		fireEvent.keyDown(button, { key: 'Escape' })

		// Dropdown should not be in DOM when closed
		expect(screen.queryByText('Vault Sandboxes')).not.toBeInTheDocument()
	})

	it('closes on click outside', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)
		expect(screen.getByText('Vault Sandboxes')).toBeInTheDocument()

		// Click outside
		fireEvent.mouseDown(document.body)

		// Dropdown should not be in DOM when closed
		expect(screen.queryByText('Vault Sandboxes')).not.toBeInTheDocument()
	})

	it('displays available sandboxes for current product', () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Check for available sandboxes section
		expect(screen.getByText(/Available.*Sandboxes/)).toBeInTheDocument()
	})

	it('opens the lab when clicking a sandbox item', async () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Wait for portal to render
		await vi.waitFor(() => {
			expect(screen.getByText(/Available.*Sandboxes/)).toBeInTheDocument()
		})

		// Find a sandbox item button within the list (not the intro button)
		const labsList = document.querySelector('ul')
		expect(labsList).toBeInTheDocument()

		// Find and click the first lab button in the list
		const labButton = labsList?.querySelector('button')
		expect(labButton).toBeInTheDocument()
		
		fireEvent.click(labButton)

		await vi.waitFor(() => {
			expect(openLabSpy).toHaveBeenCalledWith(expect.any(String))
			expect(setActiveSpy).toHaveBeenCalledWith(true)
		})
	})

	it('tracks sandbox events and interactions when clicking a lab', async () => {
		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Wait for portal to render
		await vi.waitFor(() => {
			expect(screen.getByText(/Available.*Sandboxes/)).toBeInTheDocument()
		})

		// Find a sandbox item button within the list (not the intro button)
		const labsList = document.querySelector('ul')
		expect(labsList).toBeInTheDocument()

		// Find and click the first lab button in the list
		const labButton = labsList?.querySelector('button')
		expect(labButton).toBeInTheDocument()
		
		fireEvent.click(labButton)

		await vi.waitFor(() => {
			expect(openLabSpy).toHaveBeenCalledWith(expect.any(String))
			expect(setActiveSpy).toHaveBeenCalledWith(true)
			// Verify tracking events were called
			expect(mockTrackSandboxEvent).toHaveBeenCalledWith('sandbox_open', {
				labId: expect.any(String),
				page: '/',
			})
			// Verify interaction tracking
			expect(mockTrackSandboxInteraction).toHaveBeenCalledWith(
				'hover',
				expect.any(String),
				{ page: '/' }
			)
		})
	})
})
