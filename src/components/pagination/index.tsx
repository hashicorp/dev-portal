import { useState, createContext, useContext, useMemo } from 'react'
import {
	type PropsWithChildren,
	type Dispatch,
	type SetStateAction,
} from 'react'
import classNames from 'classnames'

import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

import s from './pagination.module.css'
import { generateTruncatedList } from './helpers'

const PaginationContext = createContext({
	totalItems: 0,
	pageSize: 0,
	setPageSize: (() => void 1) as Dispatch<SetStateAction<number>>,
	page: 1,
	setPage: (() => void 1) as Dispatch<SetStateAction<number>>,
	totalPages: 0,
	onPageChange: (() => void 1) as (page: number) => void,
	onPageSizeChange: (() => void 1) as (pagesize: number) => void,
})
const usePagination = () => useContext(PaginationContext)

export interface PaginationProps {
	/** Pass the total number of items to be paginated. If no value is defined an error will be thrown. */
	totalItems: number
	/** Pass the maximum number of items to display on each page initially. If no value is defined an error will be thrown. */
	pageSize: number
	/**
	 * Set a custom initial selected page.
	 *
	 * Default: `1`
	 */
	page?: number
	/** A callback that fires when the page value changes */
	onPageChange?: (page: number) => void
	/** A callback that fires when the page size value changes */
	onPageSizeChange?: (pagesize: number) => void
}

const Pagination = ({
	totalItems,
	pageSize: _pageSize,
	page: _page = 1,
	onPageChange = () => void 1,
	onPageSizeChange = () => void 1,
	children,
}: PropsWithChildren<PaginationProps>) => {
	if (typeof totalItems !== 'number') {
		throw new Error(
			'Pagination: totalItems is required, but was not specified. Please try adding a value such as `103`.'
		)
	}
	if (typeof _pageSize !== 'number') {
		throw new Error(
			'Pagination: pageSize is required, but was not specified. Please try adding a value such as `10`.'
		)
	}

	const [page, setPage] = useState(() => _page)
	const [pageSize, setPageSize] = useState(() => _pageSize)
	return (
		<PaginationContext.Provider
			value={{
				totalItems,
				pageSize,
				setPageSize,
				page,
				setPage,
				totalPages: Math.ceil(totalItems / pageSize),
				onPageChange,
				onPageSizeChange,
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
	const start = pagination.page * pagination.pageSize - 9
	const end = Math.min(
		pagination.page * pagination.pageSize,
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
	const currentPage = pagination.page

	const rawitems = useMemo(
		() => Array.from({ length: totalPages }, (_, i) => i + 1),
		[totalPages]
	)

	const items: (number | 'ellipsis')[] = ((t: NavProps['type']) => {
		switch (t) {
			case 'numbered':
				return rawitems
			case 'truncated':
				return generateTruncatedList(rawitems, currentPage)
			case 'compact':
			default:
				return []
		}
	})(type)

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
}
const ButtonArrow = ({ type, direction }: ButtonArrowProps) => {
	const pagination = usePagination()
	const handleClick = {
		next: () => {
			// clamp upper bound
			const nextIdx = Math.min(pagination.page + 1, pagination.totalPages)
			pagination.setPage(nextIdx)
			pagination.onPageChange(nextIdx)
		},
		prev: () => {
			// clamp lower bound (0)
			const prevIdx = Math.max(pagination.page - 1, 0)
			pagination.setPage(prevIdx)
			pagination.onPageChange(prevIdx)
		},
	}[direction]

	const icon = {
		next: <IconChevronRight16 />,
		prev: <IconChevronLeft16 />,
	}[direction]

	const ariaLabel = {
		next: 'Next page',
		prev: 'Previous page',
	}[direction]

	const label = {
		next: 'Next',
		prev: 'Previous',
	}[direction]

	const isDisabled = {
		next: pagination.page === pagination.totalPages,
		prev: pagination.page === 1,
	}[direction]

	return (
		<button
			className={classNames(
				s.arrow,
				s.control,
				{
					next: s.next,
					prev: s.prev,
				}[direction]
			)}
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

interface ButtonNumberProps {
	page: number
}

const ButtonNumber = ({
	children,
	page,
}: PropsWithChildren<ButtonNumberProps>) => {
	const pagination = usePagination()
	const handleClick = () => {
		pagination.setPage(page)
		// don't trigger callback if the current page is already selected
		if (pagination.page !== page) {
			pagination.onPageChange(page)
		}
	}
	return (
		<button
			className={classNames(s.control)}
			type="button"
			onClick={handleClick}
		>
			<span className={'g-screen-reader-only'}>page&nbsp;</span>
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
		pagination.setPage(1)
		const newPageSize = Number(e.target.value)
		pagination.setPageSize(newPageSize)
		// don't trigger callbacks if pagesize didn't change
		if (pagination.pageSize !== newPageSize) {
			pagination.onPageSizeChange(newPageSize)
			pagination.onPageChange(1)
		}
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
