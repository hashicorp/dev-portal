import { useState, createContext, useContext } from 'react'
import {
	type PropsWithChildren,
	type Dispatch,
	type SetStateAction,
} from 'react'
import classNames from 'classnames'

import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

import s from './pagination.module.css'

const PaginationContext = createContext({
	totalItems: 0,
	itemsPerPage: 0,
	setItemsPerPage: (() => void 1) as Dispatch<SetStateAction<number>>,
	currentPage: 1,
	setCurrentPage: (() => void 1) as Dispatch<SetStateAction<number>>,
	totalPages: 0,
	onSelectPage: (() => void 1) as (page: number) => void,
})
const usePagination = () => useContext(PaginationContext)

export interface PaginationProps {
	/** Pass the total number of items to be paginated. If no value is defined an error will be thrown. */
	totalItems: number
	/** Pass the maximum number of items to display on each page initially. If no value is defined an error will be thrown. */
	itemsPerPage: number
	/**
	 * Set a custom initial selected page.
	 *
	 * Default: `1`
	 */
	currentPage?: number
	onSelectPage?: (page: number) => void
}
const Pagination = ({
	totalItems,
	itemsPerPage: _itemsPerPage,
	currentPage: _currentPage = 1,
	onSelectPage = () => void 1,
	children,
}: PropsWithChildren<PaginationProps>) => {
	if (typeof totalItems !== 'number') {
		throw new Error(
			'Pagination: totalItems is required, but was not specified. Please try adding a value such as `103`.'
		)
	}
	if (typeof _itemsPerPage !== 'number') {
		throw new Error(
			'Pagination: itemsPerPage is required, but was not specified.  Please try adding a value such as `10`.'
		)
	}

	const [itemsPerPage, setItemsPerPage] = useState(() => _itemsPerPage)
	const [currentPage, setCurrentPage] = useState(() => _currentPage)
	return (
		<PaginationContext.Provider
			value={{
				totalItems,
				itemsPerPage,
				setItemsPerPage,
				currentPage,
				setCurrentPage,
				totalPages: Math.ceil(totalItems / itemsPerPage),
				onSelectPage,
			}}
		>
			<div
				// data-debug
				className={s.pagination}
			>
				{children}
			</div>
		</PaginationContext.Provider>
	)
}

export interface InfoProps {
	/**
	 * Hide display of total items in the UI.
	 *
	 * Defaults to `true`
	 */
	showTotalItems?: boolean
}
const Info = ({ showTotalItems = true }: InfoProps) => {
	const pagination = usePagination()
	const start = pagination.currentPage * pagination.itemsPerPage - 9
	const end = Math.min(
		pagination.currentPage * pagination.itemsPerPage,
		pagination.totalItems
	)
	return (
		<div className={s.info}>
			{start} – {end}
			{showTotalItems ? ` of ${pagination.totalItems}` : null}
		</div>
	)
}

export interface NavProps {
	/**
	 * Sets the type of Pagination.Nav.
	 */
	type?: 'compact' | 'numbered' | 'truncated'
	/**
	 * Used in displaying the page numbers for "numbered" type and for determining the next page to navigate to.
	 *
	 * `totalPages` is calculated by the Pagination wrapper component when used.
	 * However, it is required if Pagination.Nav is used as a stand alone component.
	 */
	totalPages?: number
}

function generatedTruncatedList(
	array: number[],
	currentPage
): (number | 'ellipsis')[] {
	// do not truncate if there are 5 or fewer pages
	const bypass = array.length <= 5
	if (bypass) {
		return array
	}

	const isLeft = currentPage <= 3
	const isRight = currentPage >= array.length - 2

	// [1,2,3,4,...,99,100]
	if (isLeft) {
		return (
			array
				.slice(0, 4)
				// @ts-expect-error - the output array is typed as (number | 'ellipsis')[]
				.concat('ellipsis' as const)
				.concat(array.slice(-2))
		)
	}
	// [1,2,...,97,98,99,100]
	if (isRight) {
		return (
			array
				.slice(0, 2)
				// @ts-expect-error - the output array is typed as (number | 'ellipsis')[]
				.concat('ellipsis' as const)
				.concat(array.slice(-4))
		)
	}
	// [1,...3,4,5,...,100]
	return [
		1,
		'ellipsis' as const,
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'ellipsis' as const,
	].concat(array.slice(-1))
}

const Nav = ({ type = 'compact', ...props }: NavProps) => {
	const pagination = usePagination()

	const totalPages = props.totalPages ?? pagination.totalPages
	const currentPage = pagination.currentPage

	const rawitems = Array.from({ length: totalPages }).map((_, i) => i + 1)

	const items: (number | 'ellipsis')[] =
		// eslint-disable-next-line no-nested-ternary
		type === 'numbered'
			? rawitems
			: type === 'truncated'
			? generatedTruncatedList(rawitems, currentPage)
			: []

	return (
		<nav className={s.nav} aria-label="Pagination navigation">
			<ButtonArrow type={type} direction="prev" />
			{type !== 'compact' && (
				<ul className={s['page-list']}>
					{items.map((e, i) => {
						if (e === 'ellipsis') {
							// This key will be different on every re-render which is OK
							const key = `${e}-${i}`
							return (
								<li className={classNames(s['page-item'])} key={key}>
									<div className={s.ellipsis}>...</div>
								</li>
							)
						}

						const isSelected = e === currentPage
						return (
							<li
								className={classNames(s['page-item'], {
									[s['is-selected']]: isSelected,
								})}
								// This key will be stable between re-renders
								// which prevents react from removing focus from
								// the previous `document.activeElement`
								key={e}
							>
								<ButtonNumber page={e}>{e}</ButtonNumber>
							</li>
						)
					})}
				</ul>
			)}
			<ButtonArrow type={type} direction="next" />
		</nav>
	)
}

interface ButtonArrowProps {
	type: NavProps['type']
	direction: 'next' | 'prev'
	active?: boolean
}
const ButtonArrow = ({ type, direction }: ButtonArrowProps) => {
	const pagination = usePagination()
	const handleClick = () => {
		if (direction === 'next') {
			// clamp upper bound
			const nextIdx = Math.min(
				pagination.currentPage + 1,
				pagination.totalPages
			)
			pagination.setCurrentPage(nextIdx)
			pagination.onSelectPage(nextIdx)
		} else if (direction === 'prev') {
			// clamp lower bound (0)
			const prevIdx = Math.max(pagination.currentPage - 1, 0)
			pagination.setCurrentPage(prevIdx)
			pagination.onSelectPage(prevIdx)
		}
	}
	const icon =
		// eslint-disable-next-line no-nested-ternary
		direction === 'next' ? (
			<IconChevronRight16 />
		) : direction === 'prev' ? (
			<IconChevronLeft16 />
		) : null

	const ariaLabel =
		// eslint-disable-next-line no-nested-ternary
		direction === 'next'
			? 'Next page'
			: direction === 'prev'
			? 'Previous page'
			: undefined

	const label =
		// eslint-disable-next-line no-nested-ternary
		direction === 'next' ? 'Next' : direction === 'prev' ? 'Previous' : null

	const isDisabled =
		direction === 'next'
			? pagination.currentPage === pagination.totalPages
			: pagination.currentPage === 1
	return (
		<button
			className={classNames(s.arrow, s.control, {
				[s.prev]: direction === 'prev',
				[s.next]: direction === 'next',
			})}
			aria-label={ariaLabel}
			onClick={handleClick}
			disabled={isDisabled}
		>
			{icon}
			{type === 'compact' && (
				<span className={classNames(s.label)} aria-hidden="true">
					{label}
				</span>
			)}
		</button>
	)
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ButtonNumberProps {
	page: number
}

const ButtonNumber = ({
	children,
	page,
}: PropsWithChildren<ButtonNumberProps>) => {
	const pagination = usePagination()
	const handleClick = () => {
		pagination.setCurrentPage(page)
		// don't trigger callback if the current page is already selected
		if (pagination.currentPage !== page) {
			pagination.onSelectPage(page)
		}
	}
	return (
		<button
			className={classNames(s.control)}
			type="button"
			onClick={handleClick}
		>
			{/* TODO: extract sr-only to global scope */}
			<span className={s['sr-only']}>page&nbsp;</span>
			{children}
		</button>
	)
}

export interface SizeSelectorProps {
	/**
	 * Set the page sizes users can select from. If no value is defined an error will be thrown.
	 */
	sizes: number[]
	/**
	 * Instead of selecting the initial option which is the default, you can select one of the other sizes options.
	 *
	 * Normally passed in as an argument on the Pagination wrapper component but can be added to Pagination.SizeSelector itself when used as a standalone component
	 */
	itemsPerPage?: number
}
const SizeSelector = ({ sizes }: SizeSelectorProps) => {
	const pagination = usePagination()

	// changing page size should reset the current page to 1
	const handleChange = (e) => {
		pagination.setCurrentPage(1)
		const value = Number(e.target.value)
		pagination.setItemsPerPage(value)
	}
	return (
		<div className={s['size-selector']}>
			<label className={s.label}>Items per page</label>
			<select className={s.select} onChange={handleChange}>
				{sizes.map((e) => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</select>
		</div>
	)
}

export default Object.assign(Pagination, {
	Info,
	Nav,
	SizeSelector,
})
