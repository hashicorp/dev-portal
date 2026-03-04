/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import TutorialCardsGridList from '../index'

const mockUseBookmarksByTutorialIds = vi.fn()
const mockTutorialCardWithAuthElements = vi.fn()
const mockTutorialCard = vi.fn()

vi.mock('hooks/bookmarks', () => ({
	useBookmarksByTutorialIds: (...args: unknown[]) =>
		mockUseBookmarksByTutorialIds(...args),
}))

vi.mock('components/cards-grid-list', () => ({
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="cards-grid-list">{children}</div>
	),
}))

vi.mock('components/tutorial-card', () => ({
	TutorialCardWithAuthElements: (props: { id: string; heading: string }) => {
		mockTutorialCardWithAuthElements(props)
		return <div data-testid={`auth-card-${props.id}`}>{props.heading}</div>
	},
	default: (props: { heading: string }) => {
		mockTutorialCard(props)
		return <div data-testid={`plain-card-${props.heading}`}>{props.heading}</div>
	},
}))

describe('TutorialCardsGridList', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockUseBookmarksByTutorialIds.mockReturnValue({})
	})

	it('renders auth tutorial cards and prefetches bookmarks by default', () => {
		render(
			<TutorialCardsGridList
				tutorials={[
					{
						id: 'vault-sandbox',
						collectionId: null as unknown as string,
						heading: 'Vault Sandbox',
						description: 'desc',
						duration: 'Interactive Sandbox',
						hasInteractiveLab: true,
						hasVideo: false,
						url: '/vault/sandbox',
						productsUsed: ['vault'],
					},
				]}
			/>
		)

		expect(screen.getByTestId('auth-card-vault-sandbox')).toBeInTheDocument()
		expect(mockTutorialCardWithAuthElements).toHaveBeenCalledTimes(1)
		expect(mockUseBookmarksByTutorialIds).toHaveBeenCalledWith({
			tutorialIds: ['vault-sandbox'],
		})
	})

	it('disables user-state behavior for sandbox-style cards', () => {
		render(
			<TutorialCardsGridList
				enableUserState={false}
				tutorials={[
					{
						id: 'vault-sandbox',
						collectionId: null as unknown as string,
						heading: 'Vault Sandbox',
						description: 'desc',
						duration: 'Interactive Sandbox',
						hasInteractiveLab: true,
						hasVideo: false,
						url: '/vault/sandbox',
						productsUsed: ['vault'],
					},
				]}
			/>
		)

		expect(screen.getByTestId('plain-card-Vault Sandbox')).toBeInTheDocument()
		expect(mockTutorialCardWithAuthElements).not.toHaveBeenCalled()
		expect(mockUseBookmarksByTutorialIds).toHaveBeenCalledWith({
			tutorialIds: ['vault-sandbox'],
			enabled: false,
		})
	})
})