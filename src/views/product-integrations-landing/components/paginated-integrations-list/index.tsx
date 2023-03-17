/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
					<div className="g-hide-on-mobile">
						<Pagination.Info />
					</div>
					<div className="g-hide-on-mobile">
						<Pagination.Nav type="truncated" />
					</div>
					<div className="g-hide-on-tablet g-hide-on-desktop">
						<Pagination.Nav type="compact" />
					</div>
					<div className="g-hide-on-mobile g-hide-on-desktop">
						<Pagination.SizeSelector sizes={[4, 8, 16, 24]} />
					</div>
				</Pagination>
			</div>
		</div>
	)
}
