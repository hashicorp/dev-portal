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

const mockUseInstruqtEmbed = vi.fn()
vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: () => mockUseInstruqtEmbed(),
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

		mockUseInstruqtEmbed.mockImplementation(() => ({
			openLab: vi.fn(),
			setActive: vi.fn(),
			labId: null,
			active: false,
			closeLab: vi.fn(),
			hasConfigError: false,
			configErrors: [],
			labSource: null,
			tutorialLabId: null,
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

	it('navigates to sandbox page when clicking a sandbox item', async () => {
		const mockPush = vi.fn().mockResolvedValue(true)
		mockUserRouter.mockImplementation(() => ({
			asPath: '/',
			push: mockPush,
			events: {
				on: vi.fn(),
				off: vi.fn(),
			},
			query: {},
		}))

		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Find a sandbox item and click it
		const sandboxItem = screen.getByText('Vault Sandbox')
		fireEvent.click(sandboxItem.closest('button'))

		// Wait for setTimeout
		await vi.waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith(
				expect.stringContaining('/vault/sandbox?launch=')
			)
		})
	})

	it('tracks sandbox events and interactions when clicking a lab', async () => {
		const mockPush = vi.fn().mockResolvedValue(true)
		mockUserRouter.mockImplementation(() => ({
			asPath: '/',
			push: mockPush,
			events: {
				on: vi.fn(),
				off: vi.fn(),
			},
			query: {},
		}))

		render(<SandboxDropdown ariaLabel="Sandbox menu" label="Sandbox" />)
		const button = screen.getByRole('button', { name: 'Sandbox menu' })

		// Open dropdown
		fireEvent.click(button)

		// Find a sandbox item and click it
		const sandboxItem = screen.getByText('Vault Sandbox')
		fireEvent.click(sandboxItem.closest('button'))

		// Wait for setTimeout
		await vi.waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith(
				expect.stringContaining('/vault/sandbox?launch=')
			)
		})

		// Verify tracking events were called
		expect(mockTrackSandboxEvent).toHaveBeenCalledWith('sandbox_open', {
			labId: expect.any(String),
			page: '/',
		})

		// Verify interaction tracking
		expect(mockTrackSandboxInteraction).toHaveBeenCalledWith(
			'hover',
			expect.any(String),
			{
				page: '/',
			}
		)
	})
})
