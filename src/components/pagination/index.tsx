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
	onSelectPage: (() => void 1) as (page: number, pagesize: number) => void,
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
	/** A callback */
	onSelectPage?: (page: number, pagesize: number) => void
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
			'Pagination: itemsPerPage is required, but was not specified. Please try adding a value such as `10`.'
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
			<div className={s.pagination}>{children}</div>
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
}

const Nav = ({ type = 'compact' }: NavProps) => {
	const pagination = usePagination()

	const totalPages = pagination.totalPages
	const currentPage = pagination.currentPage

	const rawitems = Array.from({ length: totalPages }, (_, i) => i + 1)

	const items: (number | 'ellipsis')[] =
		// eslint-disable-next-line no-nested-ternary
		type === 'numbered'
			? rawitems
			: type === 'truncated'
			? generateTruncatedList(rawitems, currentPage)
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

// branch is a helper function to return a
// generic value based on a "direction" string
function branch<T = unknown>(
	direction: 'prev' | 'next',
	obj: { prev: T; next: T }
) {
	return obj[direction]
}

interface ButtonArrowProps {
	type: NavProps['type']
	direction: 'next' | 'prev'
}
const ButtonArrow = ({ type, direction }: ButtonArrowProps) => {
	const pagination = usePagination()
	const handleClick = branch(direction, {
		next: () => {
			// clamp upper bound
			const nextIdx = Math.min(
				pagination.currentPage + 1,
				pagination.totalPages
			)
			pagination.setCurrentPage(nextIdx)
			pagination.onSelectPage(nextIdx, pagination.itemsPerPage)
		},
		prev: () => {
			// clamp lower bound (0)
			const prevIdx = Math.max(pagination.currentPage - 1, 0)
			pagination.setCurrentPage(prevIdx)
			pagination.onSelectPage(prevIdx, pagination.itemsPerPage)
		},
	})

	const icon = branch(direction, {
		next: <IconChevronRight16 />,
		prev: <IconChevronLeft16 />,
	})

	const ariaLabel = branch(direction, {
		next: 'Next page',
		prev: 'Previous page',
	})

	const label = branch(direction, {
		next: 'Next',
		prev: 'Previous',
	})

	const isDisabled = branch(direction, {
		next: pagination.currentPage === pagination.totalPages,
		prev: pagination.currentPage === 1,
	})

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
			pagination.onSelectPage(page, pagination.itemsPerPage)
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
}
const SizeSelector = ({ sizes }: SizeSelectorProps) => {
	const pagination = usePagination()

	// changing page size should reset the current page to 1
	const handleChange = (e) => {
		pagination.setCurrentPage(1)
		const newPageSize = Number(e.target.value)
		pagination.setItemsPerPage(newPageSize)

		pagination.onSelectPage(1, newPageSize)
	}

	return (
		<div className={s['size-selector']}>
			<label className={s.label}>
				Items per page
				<select className={s.select} onChange={handleChange}>
					{sizes.map((e) => (
						<option key={e} value={e}>
							{e}
						</option>
					))}
				</select>
			</label>
		</div>
	)
}

export default Object.assign(Pagination, {
	Info,
	Nav,
	SizeSelector,
})

// accepts an array and returns a truncated array with interlaced "ellipsis"
// items, based on the current page
export function generateTruncatedList(
	array: number[],
	currentPage: number
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
