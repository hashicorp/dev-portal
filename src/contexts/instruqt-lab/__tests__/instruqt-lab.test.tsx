/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useRouter } from 'next/router'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import React, {
	createContext,
	useContext,
	Dispatch,
	SetStateAction,
} from 'react'
import InstruqtProvider from '../index'

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
	useRouter: vi.fn(),
}))

vi.mock('lib/posthog-events', () => ({
	trackSandboxEvent: vi.fn(),
	SANDBOX_EVENT: {
		SANDBOX_OPEN: 'sandbox_open',
		SANDBOX_CLOSED: 'sandbox_closed',
	},
}))

vi.mock('content/sandbox/sandbox.json', () => ({
	default: {
		products: ['test-product'],
		labs: [
			{
				labId: 'test-product/test-lab/test-lab-id',
				title: 'Test Lab',
				description:
					'Test lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/test-lab?token=em_test555',
			},
			{
				labId: 'test-product/stored-lab/stored-lab-id',
				title: 'Stored Lab',
				description:
					'Stored lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/stored-lab?token=em_test666',
			},
			{
				labId: 'test-product/close-test-lab/close-test-lab-id',
				title: 'Close Test Lab',
				description:
					'Close test lab description that is long enough to pass validation',
				products: ['test-product'],
				instruqtTrack: 'hashicorp-learn/tracks/close-test-lab?token=em_test777',
			},
		],
	},
}))

const mockUseRouter = vi.mocked(useRouter)
const mockTrackSandboxEvent = vi.mocked(trackSandboxEvent)

interface InstruqtContextProps {
	labId: string | null
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
	openLab: (labId: string) => void
	closeLab: () => void
	hasConfigError: boolean
	configErrors: string[]
}

const InstruqtContext = createContext<InstruqtContextProps>({
	labId: null,
	active: false,
	setActive: () => {},
	openLab: () => {},
	closeLab: () => {},
	hasConfigError: false,
	configErrors: [],
})

const useTestInstruqtEmbed = (): InstruqtContextProps =>
	useContext(InstruqtContext)

const createMockLocalStorage = () => {
	const storage = new Map<string, string>()

	return {
		getItem: vi.fn((key: string) => storage.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			storage.set(key, value)
		}),
		removeItem: vi.fn((key: string) => {
			storage.delete(key)
		}),
		clear: vi.fn(() => storage.clear()),
		length: 0,
		key: vi.fn(),
	}
}

describe('InstruqtEmbed Context', () => {
	let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

	beforeEach(() => {
		vi.clearAllMocks()

		mockLocalStorage = createMockLocalStorage()
		Object.defineProperty(window, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
		})

		mockUseRouter.mockReturnValue({
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
	})

	it('provides default context values', async () => {
		const TestComponent = () => {
			const context = useTestInstruqtEmbed()
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
		mockLocalStorage.getItem.mockReturnValue(storedState)

		const TestComponent = () => {
			const context = useTestInstruqtEmbed()
			return (
				<div>
					<span data-testid="lab-id">{context.labId || 'no-lab'}</span>
					<span data-testid="active">
						{context.active ? 'active' : 'inactive'}
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

		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('instruqt-lab-state')
		expect(await screen.findByTestId('lab-id')).toHaveTextContent(
			'stored-lab-id'
		)
		expect(await screen.findByTestId('active')).toHaveTextContent('active')
	})

	it('persists state changes to localStorage', async () => {
		const TestComponent = () => {
			const { openLab } = useTestInstruqtEmbed()
			return <button onClick={() => openLab('test-lab-id')}>Open Lab</button>
		}

		await act(async () => {
			render(
				<InstruqtProvider>
					<TestComponent />
				</InstruqtProvider>
			)
		})

		await act(async () => {
			fireEvent.click(await screen.findByText('Open Lab'))
		})

		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			'instruqt-lab-state',
			JSON.stringify({
				active: true,
				storedLabId: 'test-lab-id',
			})
		)
	})

	it('tracks sandbox events when opening a lab', async () => {
		const TestComponent = () => {
			const { openLab } = useTestInstruqtEmbed()
			return <button onClick={() => openLab('test-lab-id')}>Open Lab</button>
		}

		await act(async () => {
			render(
				<InstruqtProvider>
					<TestComponent />
				</InstruqtProvider>
			)
		})

		await act(async () => {
			fireEvent.click(await screen.findByText('Open Lab'))
		})

		expect(mockTrackSandboxEvent).toHaveBeenCalledWith(
			SANDBOX_EVENT.SANDBOX_OPEN,
			{
				labId: 'test-lab-id',
				page: '/test-path',
			}
		)
	})

	it('tracks sandbox events when closing a lab', async () => {
		const TestComponent = () => {
			const { openLab, closeLab } = useTestInstruqtEmbed()
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

		await act(async () => {
			render(
				<InstruqtProvider>
					<TestComponent />
				</InstruqtProvider>
			)
		})

		await act(async () => {
			fireEvent.click(await screen.findByTestId('open'))
		})

		await act(async () => {
			fireEvent.click(await screen.findByTestId('close'))
		})

		expect(mockTrackSandboxEvent).toHaveBeenCalledWith(
			SANDBOX_EVENT.SANDBOX_CLOSED,
			{
				labId: 'close-test-lab-id',
				page: '/test-path',
			}
		)
	})
})
