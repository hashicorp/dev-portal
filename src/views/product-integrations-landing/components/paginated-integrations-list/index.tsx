import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import classNames from 'classnames'
import { Integration } from 'lib/integrations-api-client/integration'
import { useEffect, useState } from 'react'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'

interface PaginatedIntegrationsListProps {
	integrations: Array<Integration>
	itemsPerPage?: number
}

export default function PaginatedIntegrationsList({
	integrations,
	itemsPerPage = 8,
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

const COLLAPSED = '...'

function paginatedArray(
	numberOfPages: number,
	currentPage: number
): Array<string | number> {
	// The base number of pages that will be shown next the our current page.
	const BUFFER: number = 2

	// The additional number of pages that will be shown next to the left / right
	// of the currentPage, based off of unused pages on the left / right
	const addlLeftBuffer = Math.max(currentPage + BUFFER + 1 - numberOfPages, 0)
	const addlRightBuffer = Math.max(-1 * (currentPage - BUFFER - 2), 0)

	// Calculate the Raw Array (1,2,3,4...)
	const rawArray = Array.from({ length: numberOfPages }, (_, i) => i + 1)
	if (rawArray.length < 1 + BUFFER + 1 + BUFFER + 1) {
		// There's no chance of needing to append any '...'
		return rawArray
	}

	// The First element in the array always should be displayed
	const first = rawArray.slice(0, 1)

	// The items to the left of the currentPage
	const left = rawArray.slice(
		currentPage - 1 - BUFFER - addlLeftBuffer,
		currentPage
	)
	// The items to the right of the currentPage
	const right = rawArray.slice(
		currentPage - 1,
		currentPage + BUFFER + addlRightBuffer
	)
	// The last element in the array always should be displayed
	const last = rawArray.slice(rawArray.length - 1, rawArray.length)

	// Combine the parts & remote the non-unique elements
	let resultArray: Array<string | number> = first
		.concat(left)
		.concat(right)
		.concat(last)
	resultArray = resultArray.filter((item, pos) => {
		return resultArray.indexOf(item) === pos
	})

	// If there is a gap between the first item & second item, append a '...'
	if ((resultArray[0] as number) + 1 !== resultArray[1]) {
		resultArray.splice(1, 0, COLLAPSED)
	}

	// If there is a gap between the last item & second to last item, append a '...
	if (
		(resultArray[resultArray.length - 1] as number) - 1 !==
		resultArray[resultArray.length - 2]
	) {
		resultArray.splice(resultArray.length - 1, 0, COLLAPSED)
	}

	// OK
	return resultArray
}

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
	paginatedArray(numberOfPages, currentPage)
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

			{paginatedArray(numberOfPages, currentPage).map((pageNum, i) => {
				if (pageNum === COLLAPSED) {
					return (
						// eslint-disable-next-line react/no-array-index-key
						<a key={i} className={s.disabled}>
							...
						</a>
					)
				} else {
					return (
						// eslint-disable-next-line react/jsx-key, jsx-a11y/anchor-is-valid
						<a
							// eslint-disable-next-line react/no-array-index-key
							key={i}
							className={classNames({
								[s.activePage]: currentPage === pageNum,
							})}
							onClick={(e) => {
								e.preventDefault()
								onPageClicked(pageNum as number)
							}}
						>
							{pageNum}
						</a>
					)
				}
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
