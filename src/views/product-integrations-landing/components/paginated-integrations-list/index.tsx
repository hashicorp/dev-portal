import { Integration } from 'lib/integrations-api-client/integration'
import { useEffect, useRef, useState } from 'react'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'
import Pagination from 'components/pagination'

interface PaginatedIntegrationsListProps {
	integrations: Array<Integration>
}

export default function PaginatedIntegrationsList({
	integrations,
}: PaginatedIntegrationsListProps) {
	const isFirstRender = useRef(true)
	const [itemsPerPage, setItemsPerPage] = useState(8)
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
	const [currentPage, setCurrentPage] = useState(1)
	const currentPageIntegrations = sortedIntegrations.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	// If our integrations change, set the page back to 1
	useEffect(() => {
		setCurrentPage(1)
	}, [sortedIntegrations])

	/**
	 * If our pagination page changes, scroll up to the top of the wrapper
	 * However, don't scroll to the wrapper if this is the first render.
	 */
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
		} else {
			window.scrollTo(0, 0)
		}
	}, [currentPage])

	return (
		<div className={s.paginatedIntegrationsList}>
			<IntegrationsList integrations={currentPageIntegrations} />
			{/* It's possible that all integrations display on a single page
      in that case, just don't even show the paginator. */}
			{currentPageIntegrations.length < integrations.length && (
				<div className={s.paginatorWrapper}>
					<Pagination
						totalItems={integrations.length}
						pageSize={8}
						page={1}
						onPageChange={setCurrentPage}
						onPageSizeChange={setItemsPerPage}
					>
						<Pagination.Info />
						<Pagination.Nav type="truncated" />
						<Pagination.SizeSelector sizes={[4, 8, 16, 24]} />
					</Pagination>
				</div>
			)}
		</div>
	)
}
