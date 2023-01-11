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
import {
	ButtonArrowProps,
	ButtonNumberProps,
	InfoProps,
	NavProps,
	PaginationProps,
	SizeSelectorProps,
} from './types'

const PaginationContext = createContext({
	totalItems: 0,
	pageSize: 0,
	setPageSize: (() => void 1) as Dispatch<SetStateAction<number>>,
	page: 1,
	setPage: (() => void 1) as Dispatch<SetStateAction<number>>,
	totalPages: 0,
})
const usePagination = () => useContext(PaginationContext)

const Pagination = ({
	totalItems,
	pageSize: _pageSize,
	page: _page = 1,
	onPageChange = () => void 1,
	onPageSizeChange = () => void 1,
	children,
}: PropsWithChildren<PaginationProps>) => {
	if (typeof totalItems !== 'number' || totalItems < 1) {
		throw new Error(
			'Pagination: totalItems is required, but was not specified. Please try passing a non-zero, positive value such as `103`.'
		)
	}
	if (typeof _pageSize !== 'number' || _pageSize < 1) {
		throw new Error(
			'Pagination: pageSize is required, but was not specified. Please try passing a non-zero, positive value such as `10`.'
		)
	}
	if (_page < 1) {
		throw new Error(
			'Pagination: page must be a non-zero, positive number. Please try passing a value such as `1`.'
		)
	}

	const [page, _setPage] = useState(_page)
	const [pageSize, _setPageSize] = useState(_pageSize)

	const setPage = (val: number) => {
		if (val !== page) {
			_setPage(val)
			onPageChange(val)
		}
	}

	const setPageSize = (val: number) => {
		if (val !== pageSize) {
			_setPageSize(val)
			onPageSizeChange(val)

			// by default, updating page size will reset the page to "1"
			setPage(1)
		}
	}

	return (
		<PaginationContext.Provider
			value={{
				totalItems,
				pageSize,
				setPageSize,
				page,
				setPage,
				totalPages: Math.ceil(totalItems / pageSize),
			}}
		>
			<div className={s.pagination}>{children}</div>
		</PaginationContext.Provider>
	)
}

const Info = ({ showTotalItems = true }: InfoProps) => {
	const pagination = usePagination()
	const start = pagination.page * pagination.pageSize - pagination.pageSize + 1
	const end = Math.min(
		pagination.page * pagination.pageSize,
		pagination.totalItems
	)
	return (
		<div className={s.info}>
			{start} - {end}
			{showTotalItems ? ` of ${pagination.totalItems}` : null}
		</div>
	)
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

const ButtonArrow = ({ type, direction }: ButtonArrowProps) => {
	const pagination = usePagination()
	const handleClick = {
		next: () => {
			// clamp upper bound
			const nextIdx = Math.min(pagination.page + 1, pagination.totalPages)
			pagination.setPage(nextIdx)
		},
		prev: () => {
			// clamp lower bound (0)
			const prevIdx = Math.max(pagination.page - 1, 0)
			pagination.setPage(prevIdx)
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

const ButtonNumber = ({
	children,
	page,
}: PropsWithChildren<ButtonNumberProps>) => {
	const pagination = usePagination()
	const handleClick = () => {
		pagination.setPage(page)
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

const SizeSelector = ({ sizes }: SizeSelectorProps) => {
	const pagination = usePagination()

	const handleChange = (e) => {
		const newPageSize = Number(e.target.value)
		pagination.setPageSize(newPageSize)
	}

	return (
		<div className={s['size-selector']}>
			<label className={s.label}>
				Items per page
				<select
					className={s.select}
					onChange={handleChange}
					defaultValue={pagination.pageSize}
				>
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
