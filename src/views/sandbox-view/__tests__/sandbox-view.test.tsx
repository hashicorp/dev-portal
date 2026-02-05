/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SandboxView } from '../index'
import { useRouter } from 'next/router'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import { SANDBOX_EVENT, trackSandboxEvent } from 'lib/posthog-events'
import type { ProductData } from 'types/products'

// Mock dependencies
vi.mock('next/router', () => ({
	useRouter: vi.fn(),
}))

vi.mock('contexts/instruqt-lab', () => ({
	useInstruqtEmbed: vi.fn(),
}))

vi.mock('lib/posthog-events', async () => {
	const actual = await vi.importActual<typeof import('lib/posthog-events')>('lib/posthog-events')
	return {
		...actual,
		trackSandboxEvent: vi.fn(),
	}
})

vi.mock('../utils', () => ({
	trackSandboxInteraction: vi.fn(),
}))

vi.mock('components/toast', () => ({
	toast: vi.fn(),
	ToastColor: {
		critical: 'critical',
	},
}))

vi.mock('layouts/sidebar-sidecar', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar-layout">{children}</div>
	),
}))

vi.mock('components/cards-grid-list', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="cards-grid">{children}</div>
	),
	TutorialCardsGridList: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tutorial-cards-grid">{children}</div>
	),
}))

vi.mock('components/sandbox-card', () => ({
	default: ({
		title,
		onLaunch,
		labId,
	}: {
		title: string
		onLaunch: () => void
		labId: string
	}) => (
		<button
			data-testid={`sandbox-card-${labId}`}
			onClick={onLaunch}
			type="button"
		>
			{title}
		</button>
	),
}))

vi.mock('components/tabs', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tabs">{children}</div>
	),
	Tab: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('components/dev-dot-content', () => ({
	default: () => <div data-testid="dev-dot-content">Documentation</div>,
}))

vi.mock('react-error-boundary', () => ({
	ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

vi.mock('views/docs-view/utils/get-docs-mdx-components', () => ({
	default: vi.fn(() => ({})),
}))

vi.mock('views/product-integrations-landing/components/branded-header-card', () => ({
	BrandedHeaderCard: () => <div data-testid="branded-header-card">Header</div>,
}))

const mockUseRouter = vi.mocked(useRouter)
const mockUseInstruqtEmbed = vi.mocked(useInstruqtEmbed)
const mockTrackSandboxEvent = vi.mocked(trackSandboxEvent)

describe('SandboxView - Event Tracking', () => {
	const mockProduct: ProductData = {
		name: 'Vault',
		slug: 'vault',
		algoliaConfig: {
			indexName: 'product_vault',
		},
		basePaths: ['vault'],
		rootDocsPaths: [
			{
				iconName: 'docs',
				name: 'Documentation',
				path: 'docs',
			},
		],
	}

	const mockLayoutProps = {
		breadcrumbLinks: [],
		navLevels: [],
	}

	const createMockLab = (labId: string, products: string[] = ['vault']) => ({
		labId,
		title: `Test Lab ${labId}`,
		description: 'Test lab description',
		products,
		instruqtTrack: `hashicorp-learn/tracks/${labId}`,
		documentation: null,
	})

	const mockOpenLab = vi.fn()
	const mockSetActive = vi.fn()
	const mockPush = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()

		mockUseRouter.mockReturnValue({
			asPath: '/vault/sandbox',
			push: mockPush,
			replace: vi.fn(),
			query: {},
			pathname: '/vault/sandbox',
			route: '/vault/sandbox',
			basePath: '',
			isLocaleDomain: false,
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
		} as $TSFixMe)

		mockUseInstruqtEmbed.mockReturnValue({
			openLab: mockOpenLab,
			setActive: mockSetActive,
			active: false,
			labId: null,
			closeLab: vi.fn(),
			hasConfigError: false,
			configErrors: [],
			labSource: null,
			tutorialLabId: null,
		})
	})

	describe('handleLabClick - same product', () => {
		it('tracks interaction event but does NOT track sandbox_open event when clicking lab button', () => {
			const availableSandboxes = [createMockLab('vault-sandbox-1')]

			render(
				<SandboxView
					product={mockProduct}
					layoutProps={mockLayoutProps}
					availableSandboxes={availableSandboxes}
					otherSandboxes={[]}
				/>
			)

			// Click the sandbox card button
			const cardButton = screen.getByTestId('sandbox-card-vault-sandbox-1')
			fireEvent.click(cardButton)

			// Should NOT track sandbox_open event on button click
			// (it should only fire when iframe loads)
			expect(mockTrackSandboxEvent).not.toHaveBeenCalledWith(
				SANDBOX_EVENT.SANDBOX_OPEN,
				expect.any(Object)
			)

			// Should call openLab
			expect(mockOpenLab).toHaveBeenCalled()
			expect(mockSetActive).toHaveBeenCalledWith(true)
		})
	})

	describe('handleLabClick - cross-product redirect', () => {
		it('does NOT track sandbox_open event when clicking lab button that requires redirect', () => {
			const availableSandboxes = [
				createMockLab('terraform-sandbox-1', ['terraform']),
			]

			render(
				<SandboxView
					product={mockProduct}
					layoutProps={mockLayoutProps}
					availableSandboxes={availableSandboxes}
					otherSandboxes={[]}
				/>
			)

			// Click the sandbox card button
			const cardButton = screen.getByTestId('sandbox-card-terraform-sandbox-1')
			fireEvent.click(cardButton)

			// Should NOT track sandbox_open event on button click
			// The event will be tracked when the iframe loads on the redirected page
			expect(mockTrackSandboxEvent).not.toHaveBeenCalledWith(
				SANDBOX_EVENT.SANDBOX_OPEN,
				expect.any(Object)
			)

			// Should redirect to the primary product's sandbox page
			expect(mockPush).toHaveBeenCalledWith(
				'/terraform/sandbox?launch=terraform-sandbox-1'
			)
		})
	})
})
