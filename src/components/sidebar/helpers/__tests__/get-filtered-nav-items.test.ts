/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { describe, it, expect } from 'vitest'
import { getFilteredNavItems } from '../get-filtered-nav-items'
import {
	FilteredNavItem,
	NavItemWithMetaData,
	SubmenuNavItemWithMetaData,
	LinkNavItemWithMetaData,
} from '../../types'

type NavItemWithRoutes = Extract<NavItemWithMetaData | FilteredNavItem, { routes: unknown }>

const isNavItemWithRoutes = (
	item: NavItemWithMetaData | FilteredNavItem
): item is NavItemWithRoutes => 'routes' in item

const expectNavItemWithRoutes = (
	item: NavItemWithMetaData | FilteredNavItem | undefined
): NavItemWithRoutes => {
	if (!item) {
		throw new Error('Expected nav item with routes but received undefined')
	}

	if (isNavItemWithRoutes(item)) {
		return item
	}

	throw new Error('Expected nav item with routes')
}

describe('getFilteredNavItems', () => {
	it('returns all items when filter value is empty', () => {
		const items: NavItemWithMetaData[] = [
			{ title: 'Item 1', path: '/item-1' },
			{ title: 'Item 2', path: '/item-2' },
		] as LinkNavItemWithMetaData[]

		const result = getFilteredNavItems(items, '')

		expect(result).toEqual(items)
	})

	it('filters items by title (case insensitive)', () => {
		const items: NavItemWithMetaData[] = [
			{ title: 'Getting Started', path: '/getting-started' },
			{ title: 'Advanced Topics', path: '/advanced' },
		] as LinkNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'getting')

		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({ title: 'Getting Started', matchesFilter: true })
	})

	it('filters items by alias', () => {
		const items: NavItemWithMetaData[] = [
			{ title: 'Documentation', path: '/docs', alias: 'guide' },
			{ title: 'API Reference', path: '/api' },
		] as LinkNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'guide')

		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({ title: 'Documentation', matchesFilter: true })
	})

	it('does not duplicate items when both title and alias match filter', () => {
		const items: NavItemWithMetaData[] = [
			{
				title: 'Enable logs',
				path: 'deploy/manage/monitor/logs',
				alias: 'service logs, system logs, audit logging',
			},
		] as LinkNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'logs')

		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({ title: 'Enable logs', matchesFilter: true })
	})

	it('skips items without title', () => {
		const items: NavItemWithMetaData[] = [
			{ heading: 'Section' },
			{ title: 'Valid Item', path: '/valid' },
		] as NavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'section')

		expect(result).toHaveLength(0)
	})

	it('recursively filters submenu items', () => {
		const items: NavItemWithMetaData[] = [
			{
				title: 'Parent',
				routes: [
					{ title: 'Child Match', path: '/child-match' },
					{ title: 'Other Child', path: '/other' },
				],
			},
		] as SubmenuNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'child match')

		expect(result).toHaveLength(1)
		const parent = expectNavItemWithRoutes(result[0])
		expect(parent).toMatchObject({
			title: 'Parent',
			hasChildrenMatchingFilter: true,
		})
		expect(parent.routes).toHaveLength(1)
		const child = parent.routes[0]!
		expect(child).toMatchObject({
			title: 'Child Match',
			matchesFilter: true,
		})
	})

	it('includes parent and all children when parent matches filter', () => {
		const items: NavItemWithMetaData[] = [
			{
				title: 'Parent Match',
				routes: [
					{ title: 'Child 1', path: '/child-1' },
					{ title: 'Child 2', path: '/child-2' },
				],
			},
		] as SubmenuNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'parent')

		expect(result).toHaveLength(1)
		const parent = expectNavItemWithRoutes(result[0])
		expect(parent).toMatchObject({
			title: 'Parent Match',
			matchesFilter: true,
		})
		expect(parent.routes).toHaveLength(2)
	})

	it('excludes parent when no children match filter', () => {
		const items: NavItemWithMetaData[] = [
			{
				title: 'Parent',
				routes: [
					{ title: 'Child 1', path: '/child-1' },
					{ title: 'Child 2', path: '/child-2' },
				],
			},
		] as SubmenuNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'nomatch')

		expect(result).toHaveLength(0)
	})

	it('handles deeply nested submenu items', () => {
		const items: NavItemWithMetaData[] = [
			{
				title: 'Level 1',
				routes: [
					{
						title: 'Level 2',
						routes: [
							{ title: 'Deep Match', path: '/deep' },
						],
					},
				],
			},
		] as SubmenuNavItemWithMetaData[]

		const result = getFilteredNavItems(items, 'deep')

		expect(result).toHaveLength(1)
		const levelOne = expectNavItemWithRoutes(result[0])
		const levelTwo = expectNavItemWithRoutes(levelOne.routes[0])
		const deepMatch = levelTwo.routes[0]!
		expect(deepMatch).toMatchObject({
			title: 'Deep Match',
			matchesFilter: true,
		})
	})
})
