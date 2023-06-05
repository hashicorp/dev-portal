/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
	page = 1,
	onPageChange = () => void 1,
	onPageSizeChange = () => void 1,
	children,
}: PropsWithChildren<PaginationProps>) => {
	if (typeof totalItems !== 'number' || totalItems < 0) {
		throw new Error(
			'Pagination: totalItems is required, but was not specified. Please try passing a positive value such as `103`.'
		)
	}
	if (typeof _pageSize !== 'number' || _pageSize < 1) {
		throw new Error(
			'Pagination: pageSize is required, but was not specified. Please try passing a non-zero, positive value such as `10`.'
		)
	}
	if (page < 1) {
		throw new Error(
			'Pagination: page must be a non-zero, positive number. Please try passing a value such as `1`.'
		)
	}

	const [pageSize, _setPageSize] = useState(_pageSize)

	const setPage = (val: number) => {
		if (val !== page) {
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
	const start = Math.min(
		pagination.page * pagination.pageSize - pagination.pageSize + 1,
		pagination.totalItems
	)
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

const generateNavItems = ({ currentPage, totalPages, type }) => {
	const rawItems = Array.from({ length: totalPages }, (_, i) => i + 1)

	if (type === 'numbered') {
		return rawItems
	}

	if (type === 'truncated') {
		return generateTruncatedList(rawItems, currentPage)
	}

	return []
}

const Nav = ({ type = 'compact' }: NavProps) => {
	const { page: currentPage, totalPages } = usePagination()
	const items = useMemo(
		() => generateNavItems({ currentPage, totalPages, type }),
		[currentPage, totalPages, type]
	)

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
								<ButtonNumber page={e} active={isSelected} />
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
	const { handleClick, icon, isDisabled, label, className } = {
		next: {
			handleClick: () => {
				// clamp upper bound
				const nextIdx = Math.min(pagination.page + 1, pagination.totalPages)
				pagination.setPage(nextIdx)
			},
			icon: <IconChevronRight16 />,
			label: 'Next',
			isDisabled:
				pagination.page === pagination.totalPages ||
				pagination.totalPages === 0,
			className: s.next,
		},
		prev: {
			handleClick: () => {
				// clamp lower bound (0)
				const prevIdx = Math.max(pagination.page - 1, 0)
				pagination.setPage(prevIdx)
			},
			icon: <IconChevronLeft16 />,
			label: 'Previous',
			isDisabled: pagination.page === 1 || pagination.totalPages === 0,
			className: s.prev,
		},
	}[direction]

	return (
		<button
			className={classNames(s.arrow, s.control, className)}
			aria-label={label}
			onClick={handleClick}
			disabled={isDisabled}
		>
			{icon}
			{type === 'compact' && (
				<span className={classNames(s.label)}>{label}</span>
			)}
		</button>
	)
}

const ButtonNumber = ({ page, active }: ButtonNumberProps) => {
	const pagination = usePagination()
	const handleClick = () => {
		pagination.setPage(page)
	}
	return (
		<button
			className={classNames(s.control, { [s.active]: active })}
			type="button"
			onClick={handleClick}
			aria-current={active ? 'page' : undefined}
		>
			{page}
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
					{sizes.map((size) => (
						<option key={size} value={size}>
							{size}
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
