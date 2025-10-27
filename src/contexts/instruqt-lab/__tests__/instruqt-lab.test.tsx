/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import React from 'react'
import { InstruqtProvider, useInstruqtEmbed } from '../index'

vi.mock('components/lab-embed/embed-element', () => ({
	default: () => null,
}))

vi.mock('components/lab-embed/resizable', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

vi.mock('components/sandbox-error-boundary', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

vi.mock('next/router', () => ({
	useRouter: () => ({
		asPath: '/test-path',
	}),
}))

vi.mock('lib/posthog-events', () => ({
	trackSandboxEvent: vi.fn(),
	SANDBOX_EVENT: {
		SANDBOX_OPEN: 'sandbox_open',
		SANDBOX_CLOSED: 'sandbox_closed',
	},
}))

vi.mock('lib/validate-sandbox-config', () => ({
	validateSandboxConfigWithDetailedErrors: () => ({
		isValid: true,
		errors: [],
		warnings: [],
	}),
}))

vi.mock('content/sandbox/sandbox.json', () => ({
	default: {
		products: ['test-product'],
		labs: [
			{
				labId: 'test-lab-id',
				title: 'Test Lab',
				description:
					'Test lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/test-lab?token=em_test555',
			},
			{
				labId: 'stored-lab-id',
				title: 'Stored Lab',
				description:
					'Stored lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/stored-lab?token=em_test666',
			},
			{
				labId: 'close-test-lab-id',
				title: 'Close Test Lab',
				description:
					'Close test lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/close-test-lab?token=em_test777',
			},
		],
	},
}))

const mockTrackSandboxEvent = vi.mocked(trackSandboxEvent)

describe('InstruqtEmbed Context', () => {
	let getItemSpy: ReturnType<typeof vi.spyOn>
	let setItemSpy: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		window.localStorage.clear()
		vi.clearAllMocks()

		getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
		setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

		Object.defineProperty(window, 'posthog', {
			value: {
				capture: vi.fn(),
			},
			writable: true,
		})
	})

	it('provides default context values', async () => {
		const TestComponent = () => {
			const context = useInstruqtEmbed()
			return (
				<div>
					<span data-testid="lab-id">{context.labId || 'no-lab'}</span>
					<span data-testid="active">
						{context.active ? 'active' : 'inactive'}
					</span>
				</div>
			)
		}

		render(
			<InstruqtProvider>
				<TestComponent />
			</InstruqtProvider>
		)

		expect(await screen.findByTestId('lab-id')).toHaveTextContent('no-lab')
		expect(await screen.findByTestId('active')).toHaveTextContent('inactive')
	})

	it('restores state from localStorage on mount', async () => {
		const storedState = JSON.stringify({
			active: true,
			storedLabId: 'stored-lab-id',
		})
		window.localStorage.setItem('instruqt-lab-state', storedState)

		const TestComponent = () => {
			const context = useInstruqtEmbed()
			return (
				<div>
					<span data-testid="lab-id">{context.labId || 'no-lab'}</span>
					<span data-testid="active">
						{context.active ? 'active' : 'inactive'}
					</span>
					<span data-testid="has-error">
						{context.hasConfigError ? 'has-error' : 'no-error'}
					</span>
				</div>
			)
		}

		await act(async () => {
			render(
				<InstruqtProvider>
					<TestComponent />
				</InstruqtProvider>
			)
		})

		expect(getItemSpy).toHaveBeenCalledWith('instruqt-lab-state')
		expect(await screen.findByTestId('lab-id')).toHaveTextContent(
			'stored-lab-id'
		)
		expect(await screen.findByTestId('active')).toHaveTextContent('active')
		expect(await screen.findByTestId('has-error')).toHaveTextContent('no-error')
	})

	it('persists state changes to localStorage', async () => {
		const TestComponent = () => {
			const { openLab, labId, active } = useInstruqtEmbed()
			return (
				<>
					<button onClick={() => openLab('test-lab-id')}>Open Lab</button>
					<div data-testid="lab-id">{labId || 'no-lab'}</div>
					<div data-testid="active">{active ? 'true' : 'false'}</div>
				</>
			)
		}

		render(
			<InstruqtProvider>
				<TestComponent />
			</InstruqtProvider>
		)

		fireEvent.click(screen.getByText('Open Lab'))

		await waitFor(() => {
			expect(screen.getByTestId('lab-id')).toHaveTextContent('test-lab-id')
			expect(screen.getByTestId('active')).toHaveTextContent('true')
		})

		await waitFor(
			() => {
				expect(setItemSpy).toHaveBeenCalledWith(
					'instruqt-lab-state',
					JSON.stringify({
						active: true,
						storedLabId: 'test-lab-id',
					})
				)
			},
			{ timeout: 3000 }
		)
	})

	it('tracks sandbox events when opening a lab', async () => {
		const TestComponent = () => {
			const { openLab } = useInstruqtEmbed()
			return <button onClick={() => openLab('test-lab-id')}>Open Lab</button>
		}

		render(
			<InstruqtProvider>
				<TestComponent />
			</InstruqtProvider>
		)

		fireEvent.click(screen.getByText('Open Lab'))

		await waitFor(
			() => {
				expect(mockTrackSandboxEvent).toHaveBeenCalledWith(
					SANDBOX_EVENT.SANDBOX_OPEN,
					{
						labId: 'test-lab-id',
						page: '/test-path',
					}
				)
			},
			{ timeout: 3000 }
		)
	})

	it('tracks sandbox events when closing a lab', async () => {
		const TestComponent = () => {
			const { openLab, closeLab } = useInstruqtEmbed()
			return (
				<>
					<button
						data-testid="open"
						onClick={() => openLab('close-test-lab-id')}
					>
						Open Lab
					</button>
					<button data-testid="close" onClick={() => closeLab()}>
						Close Lab
					</button>
				</>
			)
		}

		render(
			<InstruqtProvider>
				<TestComponent />
			</InstruqtProvider>
		)

		fireEvent.click(screen.getByTestId('open'))

		await new Promise((resolve) => setTimeout(resolve, 100))

		fireEvent.click(screen.getByTestId('close'))

		await waitFor(
			() => {
				expect(mockTrackSandboxEvent).toHaveBeenCalledWith(
					SANDBOX_EVENT.SANDBOX_CLOSED,
					{
						labId: 'close-test-lab-id',
						page: '/test-path',
					}
				)
			},
			{ timeout: 3000 }
		)
	})
})
