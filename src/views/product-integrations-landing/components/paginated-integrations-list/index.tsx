/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Integration } from 'lib/integrations-api-client/integration'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'
import { useEffect, useRef } from 'react'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'
import Pagination, { PaginationProps } from 'components/pagination'
import { useDeviceSize } from 'contexts/device-size'

interface PaginatedIntegrationsListProps {
	integrations: Array<Integration>
	onClearFiltersClicked: () => void
	onPageChange: PaginationProps['onPageChange']
	onPageSizeChange: PaginationProps['onPageSizeChange']
	page: PaginationProps['page']
	pageSize: PaginationProps['pageSize']
}

/**
 * A small util to guard against invalid values for our
 * pagination query params, such as NaN or negative numbers.
 */
function coerceToDefaultValue(value: number, init: number): number {
	if (isNaN(value) || value < 1) {
		return init
	}
	return value
}

export default function PaginatedIntegrationsList({
	integrations,
	onClearFiltersClicked,
	onPageSizeChange,
	page: _page,
	pageSize: _pageSize,
	onPageChange,
}: PaginatedIntegrationsListProps) {
	const isFirstRender = useRef(true)
	const containerRef = useRef(null)

	const page = coerceToDefaultValue(_page, 1)
	const pageSize = coerceToDefaultValue(_pageSize, 8)
	const currentPageIntegrations = integrations.slice(
		(page - 1) * pageSize,
		page * pageSize
	)

	/**
	 * If our pagination page changes, scroll up to the top of the wrapper.
	 *
	 * We also focus the search input, since otherwise, keyboard users would
	 * be scrolled to the top of the page (due to scrollTo), and then
	 * immediately scrolled to the bottom of the page.
	 *
	 * TODO: consider hooking into <Pagination/>'s `onPageChange`.
	 * This might be more clear than a separate effect (but for now, would
	 * not result in the same focus behaviour on the first result link.)
	 */
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
		} else {
			// Try to find the first result link, and focus it
			const targetElement = containerRef.current?.querySelector('a')
			if (targetElement) {
				targetElement.focus({ forceVisible: true })
				/**
				 * We need to scroll up a bit, as the focused item may be slightly
				 * hidden behind the top navigation bar. Note this approach is slightly
				 * brittle, as --navigationHeader. We also add an extra 64px,
				 * which makes it more clear we've scrolled to the top of results.
				 */
				const navScrollCompensation = getFullNavHeaderHeight() + 64
				window.scrollBy(0, navScrollCompensation * -1)
			}
		}
	}, [page])

	const { isDesktop, isMobile, isTablet } = useDeviceSize()

	return (
		<div className={s.paginatedIntegrationsList} ref={containerRef}>
			<IntegrationsList
				integrations={currentPageIntegrations}
				onClearFiltersClicked={onClearFiltersClicked}
			/>
			<div className={s.paginatorWrapper}>
				<Pagination
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					page={page}
					pageSize={pageSize}
					totalItems={integrations.length}
				>
					{(isDesktop || isTablet) && <Pagination.Info />}
					<Pagination.Nav type={isMobile ? 'compact' : 'truncated'} />
					{isDesktop && <Pagination.SizeSelector sizes={[4, 8, 16, 24]} />}
				</Pagination>
			</div>
		</div>
	)
}
