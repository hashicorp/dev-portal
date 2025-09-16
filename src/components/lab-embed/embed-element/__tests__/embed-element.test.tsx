/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import EmbedElement from '../index'

import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { useRouter } from 'next/router'
import { trackSandboxEvent } from 'lib/posthog-events'

vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: vi.fn(),
}))

vi.mock('next/router', () => ({
	useRouter: vi.fn(),
}))

vi.mock('lib/posthog-events', () => ({
	trackSandboxEvent: vi.fn(),
	SANDBOX_EVENT: {
		SANDBOX_LOADED: 'sandbox_loaded',
		SANDBOX_ERROR: 'sandbox_error',
		SANDBOX_RETRY: 'sandbox_retry',
	},
}))

const mockUseInstruqtEmbed = vi.mocked(useInstruqtEmbed)
const mockUseRouter = vi.mocked(useRouter)
const mockTrackSandboxEvent = vi.mocked(trackSandboxEvent)

describe('EmbedElement', () => {
	const createMockRouter = () => ({
		asPath: '/test-path',
		route: '/test-path',
		pathname: '/test-path',
		query: {},
		basePath: '',
		isLocaleDomain: false,
		push: vi.fn().mockResolvedValue(true),
		replace: vi.fn().mockResolvedValue(true),
		reload: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn().mockResolvedValue(undefined),
		beforePopState: vi.fn(),
		events: {
			on: vi.fn(),
			off: vi.fn(),
			emit: vi.fn(),
		},
		isFallback: false,
		isReady: true,
		isPreview: false,
		locale: undefined,
		locales: undefined,
		defaultLocale: undefined,
		domainLocales: undefined,
	})

	const createMockInstruqtContext = (overrides = {}) => ({
		labId: 'test-lab-id',
		active: true,
		setActive: vi.fn(),
		openLab: vi.fn(),
		closeLab: vi.fn(),
		hasConfigError: false,
		configErrors: [],
		...overrides,
	})

	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()

		mockUseRouter.mockReturnValue(createMockRouter())
		mockUseInstruqtEmbed.mockReturnValue(createMockInstruqtContext())
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.clearAllTimers()
	})

	describe('rendering and props', () => {
		it('renders an iframe with the correct props', () => {
			render(<EmbedElement />)

			const iframe = screen.getByTitle('Instruqt Lab Environment: test-lab-id')

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
			expect(iframe).toHaveAttribute(
				'aria-label',
				'Interactive lab environment for test-lab-id'
			)
			expect(iframe).toHaveAttribute('allow', 'fullscreen')
		})

		it('shows loading state initially', () => {
			render(<EmbedElement />)

			expect(screen.getByText('Loading your sandbox...')).toBeInTheDocument()
			expect(
				screen.getByText('This may take a few moments')
			).toBeInTheDocument()
			expect(
				screen.getByRole('status', { name: /loading sandbox/i })
			).toBeInTheDocument()
		})
	})

	describe('state transitions', () => {
		it('hides loading state when iframe loads', () => {
			render(<EmbedElement />)

			const iframe = screen.getByTitle('Instruqt Lab Environment: test-lab-id')

			fireEvent.load(iframe)

			expect(
				screen.queryByText('Loading your sandbox...')
			).not.toBeInTheDocument()

			expect(mockTrackSandboxEvent).toHaveBeenCalledWith('sandbox_loaded', {
				labId: 'test-lab-id',
				page: '/test-path',
			})
		})

		it('shows error state when timeout occurs', () => {
			render(<EmbedElement />)

			act(() => {
				vi.advanceTimersByTime(30000)
			})

			expect(screen.getByText('Unable to Load Sandbox')).toBeInTheDocument()
			expect(
				screen.getAllByText(/Failed to load sandbox/).length
			).toBeGreaterThan(0)
			expect(screen.getByRole('alert')).toBeInTheDocument()
		})

		it('allows retry when error occurs', () => {
			render(<EmbedElement />)

			act(() => {
				vi.advanceTimersByTime(30000)
			})

			const retryButton = screen.getByRole('button', { name: /try again/i })
			expect(retryButton).toBeInTheDocument()

			act(() => {
				fireEvent.click(retryButton)
			})

			expect(screen.getByText('Loading your sandbox...')).toBeInTheDocument()

			expect(mockTrackSandboxEvent).toHaveBeenCalledWith(
				'sandbox_retry',
				expect.objectContaining({
					labId: 'test-lab-id',
					page: '/test-path',
				})
			)
		})
	})

	describe('edge cases and error handling', () => {
		it('shows no lab selected state when labId is null', () => {
			mockUseInstruqtEmbed.mockReturnValue(
				createMockInstruqtContext({
					active: true,
					labId: null,
				})
			)

			render(<EmbedElement />)

			expect(screen.getByText('No Lab Selected')).toBeInTheDocument()
			expect(
				screen.getByText(/Please select a lab from the sandbox menu/)
			).toBeInTheDocument()
			expect(screen.getByRole('status')).toBeInTheDocument()
		})

		it('has the correct styles when not active', () => {
			mockUseInstruqtEmbed.mockReturnValue(
				createMockInstruqtContext({
					active: false,
					labId: 'test-lab-id',
				})
			)

			render(<EmbedElement />)

			const container = screen
				.getByTitle('Instruqt Lab Environment: test-lab-id')
				.closest('div')
			expect(container).toHaveClass('_hide_4118c4')
		})

		it('shows Try Again button when error occurs', () => {
			render(<EmbedElement />)

			// Trigger timeout to get error state
			act(() => {
				vi.advanceTimersByTime(30000)
			})

			// Verify retry button is present
			expect(
				screen.getByRole('button', { name: /try again/i })
			).toBeInTheDocument()
		})
	})

	describe('accessibility', () => {
		it('includes proper accessibility attributes', () => {
			render(<EmbedElement />)

			const iframe = screen.getByTitle('Instruqt Lab Environment: test-lab-id')

			// Verify accessibility attributes
			expect(iframe).toHaveAttribute(
				'aria-label',
				'Interactive lab environment for test-lab-id'
			)
			expect(iframe).toHaveAttribute('aria-live', 'polite')
			expect(iframe).toHaveAttribute('aria-busy', 'true') // Initially loading

			// Verify screen reader announcements
			expect(
				screen.getByText('Loading sandbox environment')
			).toBeInTheDocument()

			// Verify loading spinner is hidden from screen readers
			const spinner = document.querySelector('[aria-hidden="true"]')
			expect(spinner).toBeInTheDocument()
		})

		it('provides proper ARIA roles for different states', () => {
			render(<EmbedElement />)

			// Loading state
			expect(
				screen.getByRole('status', { name: /loading sandbox/i })
			).toBeInTheDocument()

			act(() => {
				vi.advanceTimersByTime(30000)
			})

			expect(screen.getByRole('alert')).toBeInTheDocument()
		})
	})
})
