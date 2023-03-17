/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useDeviceSize } from 'contexts'
import { useIntegrationsSearchContext } from 'views/product-integrations-landing/contexts/integrations-search-context'
import Pagination from 'components/pagination'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'

interface PaginatedIntegrationsListProps {
	onClearFiltersClicked: () => void
}

export default function PaginatedIntegrationsList({
	onClearFiltersClicked,
}: PaginatedIntegrationsListProps) {
	const {
		filteredIntegrations,
		paginatedIntegrations,
		page,
		setPage,
		pageSize,
		setPageSize,
	} = useIntegrationsSearchContext()

	const { isDesktop, isMobile, isTablet } = useDeviceSize()
	return (
		<div className={s.paginatedIntegrationsList}>
			<IntegrationsList
				integrations={paginatedIntegrations}
				onClearFiltersClicked={onClearFiltersClicked}
			/>
			<div className={s.paginatorWrapper}>
				<Pagination
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
					page={page}
					pageSize={pageSize}
					totalItems={filteredIntegrations.length}
				>
					{(isDesktop || isTablet) && <Pagination.Info />}
					<Pagination.Nav type={isMobile ? 'compact' : 'truncated'} />
					{isDesktop && <Pagination.SizeSelector sizes={[4, 8, 16, 24]} />}
				</Pagination>
			</div>
		</div>
	)
}
