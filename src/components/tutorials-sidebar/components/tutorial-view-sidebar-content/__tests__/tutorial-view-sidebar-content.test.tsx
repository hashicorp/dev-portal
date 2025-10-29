import { vi } from 'vitest'

// Mock hooks to avoid provider/context requirements and network
vi.mock('hooks/progress', () => ({
	useCollectionProgress: () => ({ data: {}, isLoading: false }),
	useTutorialProgress: () => ({ tutorialProgressStatus: 'not-started' }),
}))

// Mock child components to simple renderers
vi.mock('components/collection-progress-group', () => ({
	CollectionProgressStatusSection: ({ completedTutorialCount, tutorialCount, isInProgress }) => (
		<div data-testid="collection-progress">
			Progress: {completedTutorialCount}/{tutorialCount} {isInProgress ? '(in progress)' : ''}
		</div>
	),
	parseCollectionProgress: () => ({ completedTutorialCount: 0, tutorialCount: 0, isInProgress: false }),
}))

vi.mock('components/tutorial-progress-icon', () => ({
	default: () => <span data-testid="tutorial-progress-icon" />,
}))

vi.mock('components/tutorials-sidebar', () => ({
	SectionList: ({ children }) => <div data-testid="section-list">{children}</div>,
}))

vi.mock('components/sidebar/components', () => ({
	SidebarNavMenuItem: ({ item }) => (
		<a href={item.href} data-active={item.isActive ? 'true' : 'false'}>
			{item.title}
		</a>
	),
}))

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ErrorBoundary } from 'components/error-boundary'
import TutorialViewSidebarContent from '../index'
import type { Collection } from 'lib/learn-client/types'
import type { TutorialListItemProps } from 'components/tutorials-sidebar/types'
import userEvent from '@testing-library/user-event'

describe('TutorialViewSidebarContent', () => {
	it('renders with data and correct href', () => {
		const mockCollection = {
			id: 'collection-id',
			slug: 'collection-slug',
			tutorials: [{ id: 'tutorial-id', title: 'Tutorial Title' }],
		} as unknown as Collection

		const mockItems: TutorialListItemProps[] = [
			{
				text: 'Tutorial Title',
				href: '/tutorial',
				isActive: false,
				tutorialId: 'tutorial-id',
				collectionId: 'collection-id',
			},
		]

		render(<TutorialViewSidebarContent collection={mockCollection} items={mockItems} />)

		expect(screen.getByText('Tutorial Title')).toBeInTheDocument()
		const link = screen.getByText('Tutorial Title').closest('a')
		expect(link).toHaveAttribute('href', '/tutorial')
	})

	it('handles loading state gracefully (no crash, container renders)', () => {
		const mockCollection = {} as unknown as Collection // Simulate loading/missing data
		const mockItems: TutorialListItemProps[] = []

		render(
			<ErrorBoundary>
				<TutorialViewSidebarContent collection={mockCollection} items={mockItems} />
			</ErrorBoundary>
		)

		expect(screen.queryByText('Tutorial Title')).not.toBeInTheDocument()
		expect(screen.getByTestId('section-list')).toBeInTheDocument()
	})

	it('handles rapid navigation (re-render) without errors', async () => {
		const mockCollection1 = {
			id: 'collection-1',
			slug: 'collection-1-slug',
			tutorials: [{ id: 'tutorial-1', title: 'Tutorial 1' }],
		} as unknown as Collection

		const mockCollection2 = {
			id: 'collection-2',
			slug: 'collection-2-slug',
			tutorials: [{ id: 'tutorial-2', title: 'Tutorial 2' }],
		} as unknown as Collection

		const mockItems1: TutorialListItemProps[] = [
			{
				text: 'Tutorial 1',
				href: '/tutorial-1',
				isActive: false,
				tutorialId: 'tutorial-1',
				collectionId: 'collection-1',
			},
		]

		const mockItems2: TutorialListItemProps[] = [
			{
				text: 'Tutorial 2',
				href: '/tutorial-2',
				isActive: false,
				tutorialId: 'tutorial-2',
				collectionId: 'collection-2',
			},
		]

		const { rerender } = render(
			<ErrorBoundary>
				<TutorialViewSidebarContent collection={mockCollection1} items={mockItems1} />
			</ErrorBoundary>
		)

		expect(screen.getByText('Tutorial 1')).toBeInTheDocument()

		rerender(
			<ErrorBoundary>
				<TutorialViewSidebarContent collection={mockCollection2} items={mockItems2} />
			</ErrorBoundary>
		)

		expect(screen.getByText('Tutorial 2')).toBeInTheDocument()
		expect(screen.queryByText('Tutorial 1')).not.toBeInTheDocument()
	})

	it('navigates correctly when clicking a sidebar item (no error)', async () => {
		const mockCollection = {
			id: 'collection-id',
			slug: 'collection-slug',
			tutorials: [{ id: 'tutorial-id', title: 'Tutorial Title' }],
		} as unknown as Collection

		const mockItems: TutorialListItemProps[] = [
			{
				text: 'Tutorial Title',
				href: '/tutorial',
				isActive: false,
				tutorialId: 'tutorial-id',
				collectionId: 'collection-id',
			},
		]

		render(<TutorialViewSidebarContent collection={mockCollection} items={mockItems} />)

		const linkEl = screen.getByText('Tutorial Title')
		await userEvent.click(linkEl)

		expect(screen.getByText('Tutorial Title')).toBeInTheDocument()
		expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument()
		const link = linkEl.closest('a')
		expect(link).toHaveAttribute('href', '/tutorial')
	})
})
