/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRef } from 'react'
import { useQueryParam, NumberParam, withDefault } from 'use-query-params'
import { Integration } from 'lib/integrations-api-client/integration'
import { useDeviceSize } from 'contexts/device-size'
import Pagination from 'components/pagination'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'

interface PaginatedIntegrationsListProps {
	integrations: Array<Integration>
	onClearFiltersClicked: () => void
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

/**
 * @TODO handle focus management on page & page size changes, if needed.
 * https://app.asana.com/0/1202097197789424/1203752518527704/f
 */
export default function PaginatedIntegrationsList({
	integrations,
	onClearFiltersClicked,
}: PaginatedIntegrationsListProps) {
	const containerRef = useRef(null)
	const [_itemsPerPage, setItemsPerPage] = useQueryParam(
		'size',
		withDefault(NumberParam, 8),
		{
			enableBatching: true,
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)
	const itemsPerPage = coerceToDefaultValue(_itemsPerPage, 8)

	// Sort integrations alphabetically. Right now this is our
	// preferred way of sorting. In the event we want to add different
	// sorting options in the future to this list, we'll need to support
	// them at this component.
	const sortedIntegrations = integrations.sort(
		(a: Integration, b: Integration): number => {
			if (a.name < b.name) {
				return -1
			} else if (a.name > b.name) {
				return 1
			} else {
				return 0
			}
		}
	)

	// Keep track of the current page & Integrations to display
	const [_currentPage, setCurrentPage] = useQueryParam(
		'page',
		withDefault(NumberParam, 1),
		{
			updateType: 'replaceIn',
			removeDefaultsFromUrl: true,
		}
	)

	const currentPage = coerceToDefaultValue(_currentPage, 1)

	const currentPageIntegrations = sortedIntegrations.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const { isDesktop, isMobile, isTablet } = useDeviceSize()

	return (
		<div className={s.paginatedIntegrationsList} ref={containerRef}>
			<IntegrationsList
				integrations={currentPageIntegrations}
				onClearFiltersClicked={onClearFiltersClicked}
			/>
			<div className={s.paginatorWrapper}>
				<Pagination
					totalItems={integrations.length}
					pageSize={itemsPerPage}
					page={currentPage}
					onPageChange={(page) => setCurrentPage(page)}
					onPageSizeChange={(size) => setItemsPerPage(size)}
				>
					{(isDesktop || isTablet) && <Pagination.Info />}
					<Pagination.Nav type={isMobile ? 'compact' : 'truncated'} />
					{isDesktop && <Pagination.SizeSelector sizes={[4, 8, 16, 24]} />}
				</Pagination>
			</div>
		</div>
	)
}
