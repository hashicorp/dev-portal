import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import classNames from 'classnames'
import { Integration } from 'lib/integrations-api-client/integration'
import { useState, useEffect } from 'react'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'

interface PaginatedIntegrationsListProps {
	integrations: Array<Integration>
	itemsPerPage?: number
}

export default function PaginatedIntegrationsList({
	integrations,
	itemsPerPage = 12,
}: PaginatedIntegrationsListProps) {
	// Sort integrations alphabetically
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

	return (
		<div className={s.paginatedIntegrationsList}>
			<IntegrationsList integrations={currentPageIntegrations} />
			{/* It's possible that all integrations display on a single page
      in that case, just don't even show the paginator. */}
			{currentPageIntegrations.length < integrations.length && (
				<div className={s.paginatorWrapper}>
					<Paginator
						numberOfPages={Math.ceil(integrations.length / itemsPerPage)}
						currentPage={currentPage}
						onPageClicked={(page: number) => {
							setCurrentPage(page)
						}}
					/>
				</div>
			)}
		</div>
	)
}

// =======================

interface PaginatorProps {
	numberOfPages: number
	currentPage: number
	onPageClicked: (page: number) => void
}

function Paginator({
	numberOfPages,
	currentPage,
	onPageClicked,
}: PaginatorProps) {
	return (
		<div className={s.paginator}>
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<a
				className={classNames({ [s.disabled]: currentPage === 1 })}
				onClick={(e) => {
					e.preventDefault()
					if (currentPage !== 1) {
						onPageClicked(currentPage - 1)
					}
				}}
			>
				<IconArrowLeft16 />
			</a>
			{[...Array(numberOfPages)].map((u, i: number) => {
				const pageNum: number = i + 1
				return (
					// eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-is-valid
					<a
						className={classNames({ [s.activePage]: currentPage === pageNum })}
						onClick={(e) => {
							e.preventDefault()
							onPageClicked(pageNum)
						}}
					>
						{pageNum}
					</a>
				)
			})}
			{/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
			<a
				className={classNames({ [s.disabled]: currentPage === numberOfPages })}
				onClick={(e) => {
					e.preventDefault()
					if (currentPage < numberOfPages) {
						onPageClicked(currentPage + 1)
					}
				}}
			>
				<IconArrowRight16 />
			</a>
		</div>
	)
}
